"""ELANUM – vereinfachte Konstruktion (sechs Grundkreise, fünf Brücken).

Übernommen aus dem ELANUM-Geometrie-Paket, Konstruktionsversion 4. Die Geometrie
ist unverändert; angepasst sind nur Ein- und Ausgabepfade.

Sechs Grundkreise: C1 Mantel, C2 Zentrum, C3 Oberbogen, C4 Unterbogen,
C5 Mündung oben, C6 Mündung unten. Fünf benannte Bézierbrücken verbinden sie
mit stetiger Tangente und Krümmung: B1 Rücklauf, B2 Anschluss oben,
B3 Öffnung, B4 Lippen, B5 Auslauf.

Liest assets/ELANUM-System-Ink-Curves.svg und
assets/ELANUM-Master-Spektrum-Curves.svg (Farbnetz) und schreibt:

  assets/ELANUM-System-Ink-Geometrisch.svg
  assets/ELANUM-Master-Spektrum-Geometrisch.svg
  assets/ELANUM-Konstruktion-Geometrisch.svg      (Blueprint)
  assets/ELANUM-Anschluesse-Geometrisch.svg       (B3 und B5 im Detail)
  assets/ELANUM-Konturvergleich-Geometrisch.svg
  assets/ELANUM-Konstruktion-Geometrisch.json     (Parameter und Prüfwerte)

Benötigt numpy und scipy (tools/requirements.txt). Aufruf im Repository:

  python3 tools/build_logo_geometrie.py
"""
from pathlib import Path
import math, json, re, copy, xml.etree.ElementTree as ET
import numpy as np
from scipy.interpolate import BSpline
from scipy.linalg import null_space
from scipy.special import fresnel
from scipy.optimize import least_squares

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'assets'
NAMES={'ELANUM-Ink-Geometrisch.svg':'ELANUM-System-Ink-Geometrisch.svg',
       'ELANUM-Blueprint-Geometrisch.svg':'ELANUM-Konstruktion-Geometrisch.svg',
       'ELANUM-Anschluesse-Detail.svg':'ELANUM-Anschluesse-Geometrisch.svg'}
INK='#16363B'; PAPER='#F6F1E5'; BLUE='#4D7FE8'; ROSE='#D85BA9'
NS='http://www.w3.org/2000/svg'
ET.register_namespace('',NS)

def v(x): return np.array(x,dtype=float)
def unit(a):return v([math.cos(a),math.sin(a)])
def cross(a,b):return float(a[0]*b[1]-a[1]*b[0])
def fmt(p):return f'{p[0]:.8f} {p[1]:.8f}'
def nfmt(x):return f'{x:.8f}'

class Circle:
    def __init__(self,name,c,r,label):self.name=name;self.c=v(c);self.r=float(r);self.label=label
    def state(self,angle,sense=1,offset=0):
        a=math.radians(angle); n=unit(a);t=sense*v([-n[1],n[0]])
        return self.c+(self.r+offset)*n,t,sense/(self.r+offset)
    def arc(self,a,b,sense=1,offset=0):
        p=self.state(a,sense,offset)[0];q=self.state(b,sense,offset)[0]
        delta=((b-a)*sense)%360
        return Arc(self,p,q,delta,sense,offset,a,b)

class Arc:
    def __init__(self,c,p,q,delta,sense,off,a,b):
        self.circle=c;self.p=p;self.q=q;self.delta=delta;self.sense=sense;self.off=off;self.a=a;self.b=b
    def d(self):return f'A {nfmt(self.circle.r+self.off)} {nfmt(self.circle.r+self.off)} 0 {int(self.delta>180)} {int(self.sense>0)} {fmt(self.q)}'
    def reverse(self):return Arc(self.circle,self.q,self.p,self.delta,-self.sense,self.off,self.b,self.a)
    def endpoint_state(self,end):return self.circle.state(self.b if end else self.a,self.sense,self.off)

class Cubic:
    def __init__(self,points,group='transition'):self.points=np.array(points);self.p=self.points[0];self.q=self.points[-1];self.group=group
    def d(self):return 'C '+' '.join(fmt(p) for p in self.points[1:])
    def reverse(self):return Cubic(self.points[::-1],self.group)
    def state(self,t):
        p=self.points
        q=(1-t)**3*p[0]+3*(1-t)**2*t*p[1]+3*(1-t)*t*t*p[2]+t**3*p[3]
        d=3*((1-t)**2*(p[1]-p[0])+2*(1-t)*t*(p[2]-p[1])+t*t*(p[3]-p[2]))
        dd=6*((1-t)*(p[2]-2*p[1]+p[0])+t*(p[3]-2*p[2]+p[1]))
        speed=np.linalg.norm(d)
        return q,d/speed,cross(d,dd)/speed**3
    def endpoint_state(self,end):return self.state(int(end))

def evaluate_bezier(p,t):
    q=p.copy()
    for level in range(1,len(p)):q=(1-t)*q[:-1]+t*q[1:]
    return q[0]

transition_stats=[]
def blend(s0,s1,name,speed=None,parts=4):
    p,t,k=s0;q,u,l=s1
    chord=float(np.linalg.norm(q-p))
    if speed is None:speed=chord*1.04
    L0,L1=(speed,speed) if np.isscalar(speed) else speed
    normal=lambda t:v([-t[1],t[0]])
    # Quintic Hermite construction: circle positions, tangents and signed curvature.
    points=np.array([p,p+L0*t/5,np.zeros(2),np.zeros(2),q-L1*u/5,q])
    points[2]=2*points[1]-points[0]+L0*L0*k*normal(t)/20
    points[3]=2*points[4]-points[5]+L1*L1*l*normal(u)/20
    # A clamped cubic B-spline is C2 continuous internally. Six linear endpoint
    # constraints retain position, first derivative and curvature of both circles.
    # Fit the remaining coefficients to the Hermite construction, then export
    # each spline span as an ordinary SVG cubic Bezier segment.
    knots=np.r_[np.zeros(4),np.linspace(0,1,parts+1)[1:-1],np.ones(4)]
    coeff_count=parts+3
    basis=BSpline(knots,np.eye(coeff_count),3)
    constraints=np.vstack((basis(0),basis(0,1),basis(0,2),basis(1),basis(1,1),basis(1,2)))
    targets=np.array([p,L0*t,L0*L0*k*normal(t),q,L1*u,L1*L1*l*normal(u)])
    fixed=np.linalg.lstsq(constraints,targets,rcond=None)[0]
    free=null_space(constraints)
    samples=np.linspace(0,1,160)
    design=basis(samples)
    ideal=np.array([evaluate_bezier(points,x) for x in samples])
    coeff=fixed+free@np.linalg.lstsq(design@free,ideal-design@fixed,rcond=None)[0]
    spline=BSpline(knots,coeff,3)
    curves=[];max_res=0;max_fit=0
    for i in range(parts):
        t0=i/parts;t1=(i+1)/parts
        a=spline(t0);b=spline(t1);h=t1-t0
        curve=Cubic([a,a+h*spline(t0,1)/3,b-h*spline(t1,1)/3,b],name)
        curves.append(curve)
        for tt in np.linspace(0,1,15):
            max_fit=max(max_fit,float(np.linalg.norm(curve.state(tt)[0]-evaluate_bezier(points,t0+tt*(t1-t0)))))
    max_res=max(abs(curves[0].state(0)[2]-k),abs(curves[-1].state(1)[2]-l))
    transition_stats.append(dict(name=name,cubics=parts,curvature_residual=max_res,quintic_fit_error=max_fit))
    assert max_res<1e-7,(name,max_res)
    return curves

def rev(seq):return [s.reverse() for s in seq[::-1]]
def path(seq,close=False):return 'M '+fmt(seq[0].p)+' '+' '.join(s.d() for s in seq)+(' Z' if close else '')
def circle_path(c):
    r=c.r;x,y=c.c
    return f'M {x+r:.8f} {y:.8f} A {r:.8f} {r:.8f} 0 1 1 {x-r:.8f} {y:.8f} A {r:.8f} {r:.8f} 0 1 1 {x+r:.8f} {y:.8f} Z'

def fit_exact_curve(actual,name,parts=12):
    knots=np.r_[np.zeros(4),np.linspace(0,1,parts+1)[1:-1],np.ones(4)]
    basis=BSpline(knots,np.eye(parts+3),3)
    constraints=np.vstack((basis(0),basis(0,1),basis(0,2),basis(1),basis(1,1),basis(1,2)))
    p,d,dd=actual(0.);q,e,ee=actual(1.)
    targets=np.array([p,d,dd,q,e,ee])
    fixed=np.linalg.lstsq(constraints,targets,rcond=None)[0];free=null_space(constraints)
    samples=np.linspace(0,1,721);ideal=actual(samples)[0];design=basis(samples)
    coeff=fixed+free@np.linalg.lstsq(design@free,ideal-design@fixed,rcond=None)[0]
    spline=BSpline(knots,coeff,3);curves=[]
    for i in range(parts):
        t0=i/parts;t1=(i+1)/parts;h=t1-t0;a=spline(t0);b=spline(t1)
        curves.append(Cubic([a,a+h*spline(t0,1)/3,b-h*spline(t1,1)/3,b],name))
    error=float(max(np.linalg.norm(spline(samples)-ideal,axis=1)))
    assert error<.002,(name,error)
    transition_stats.append(dict(name=name,cubics=parts,fit_error=error))
    return curves

def clothoid_state(start,tangent,k0,k1,length,t):
    t=np.asarray(t,dtype=float);theta0=math.atan2(tangent[1],tangent[0])
    a=length*k0;b=length*(k1-k0)/2
    scale=math.sqrt(2*abs(b)/math.pi)
    arg=scale*(t+a/(2*b));arg0=scale*a/(2*b)
    ss,cc=fresnel(arg);s0,c0=fresnel(arg0)
    integral=math.sqrt(math.pi/(2*abs(b)))*np.exp(1j*(theta0-a*a/(4*b)))*((cc-c0)+1j*np.sign(b)*(ss-s0))
    p=start+length*np.stack([integral.real,integral.imag],axis=-1)
    theta=theta0+a*t+b*t*t
    T=np.stack([np.cos(theta),np.sin(theta)],axis=-1)
    N=np.stack([-np.sin(theta),np.cos(theta)],axis=-1)
    d=length*T;dd=length*length*(k0+(k1-k0)*t)[...,None]*N
    return p,d,dd

b3_solutions=[]
def opening_bridge(big,mouth,name='B3 Öffnung'):
    k0=1/big.r;k1=-1/mouth.r
    def centre_error(x):
        angle,length=x;p,T,_=big.state(angle)
        q,d,dd=clothoid_state(p,T,k0,k1,length,1.)
        end_T=d/np.linalg.norm(d);N=v([-end_T[1],end_T[0]])
        return q-mouth.r*N-mouth.c
    sol=least_squares(centre_error,[320.,125.],bounds=([300.,5.],[345.,250.]),xtol=1e-13,ftol=1e-13,gtol=1e-13)
    angle,length=map(float,sol.x)
    assert np.linalg.norm(sol.fun)<1e-8,sol.fun
    end_angle=(angle+180+math.degrees(length*(k0+k1)/2))%360
    p,T,_=big.state(angle)
    actual=lambda t:clothoid_state(p,T,k0,k1,length,t)
    curves=fit_exact_curve(actual,name,parts=12)
    b3_solutions.append(dict(from_circle=big.name,to_circle=mouth.name,start_angle=angle,end_angle=end_angle,length=length,start_curvature=k0,end_curvature=k1))
    return angle,end_angle,curves

outer=Circle('C1',[624.65001702,613.27019234],460.54,'Mantel')
hole=Circle('C2',[531.15,632.98],122.05,'Zentrum')
upper=Circle('C3',[584.2188,653.1778],248.8555,'Oberbogen')
hole_angle=251.79
lower_radius=hole.r+np.linalg.norm(v([562.656,716.8092])-hole.c)
lower=Circle('C4',hole.c-(lower_radius-hole.r)*unit(math.radians(hole_angle)),lower_radius,'Unterbogen')
mouthtop=Circle('C5',[956.5768,463.728],161.8965,'Mündung oben')
mouthbottom=Circle('C6',[983.1194,459.36],187.7433,'Mündung unten')
circles=[outer,hole,upper,lower,mouthtop,mouthbottom]
half=2.25
wall_circles=[]
def spiral_reference(radius,length,t):
    t=np.asarray(t,dtype=float)
    a=length/hole.r;b=length*(1/radius-1/hole.r)/2
    scale=math.sqrt(2*abs(b)/math.pi)
    arg=scale*(t+a/(2*b));arg0=scale*a/(2*b)
    s,c=fresnel(arg);s0,c0=fresnel(arg0)
    integral=math.sqrt(math.pi/(2*abs(b)))*np.exp(1j*(math.pi/2-a*a/(4*b)))*((c-c0)+1j*np.sign(b)*(s-s0))
    start=hole.state(0)[0]
    points=start+length*np.stack([integral.real,integral.imag],axis=-1)
    angle=math.pi/2+a*t+b*t*t
    tangent=np.stack([np.cos(angle),np.sin(angle)],axis=-1)
    normal=np.stack([-np.sin(angle),np.cos(angle)],axis=-1)
    return points,tangent,normal,angle

def reference_centre(parameters):
    radius,length=parameters
    p,t,n,angle=spiral_reference(radius,length,1.)
    return p+radius*n

# Derive the broad spiral from the retained upper-circle centre. Curvature
# falls linearly from the hole radius to the upper-circle radius. There is
# no small return circle or hidden switch of radii inside this bridge.
solution=least_squares(lambda x:reference_centre(x)-upper.c,[248.,760.],bounds=([150.,350.],[350.,1000.]),xtol=1e-13,ftol=1e-13,gtol=1e-13)
upper.r=float(solution.x[0]);spiral_length=float(solution.x[1])
upper_entry=math.degrees(spiral_reference(upper.r,spiral_length,1.)[3]-math.pi/2)
assert np.linalg.norm(solution.fun)<1e-8

def spiral_bridge(offset):
    length=spiral_length;parts=24
    def actual(t):
        t=np.asarray(t,dtype=float)
        p,T,N,angle=spiral_reference(upper.r,length,t)
        # A fifth-order fade makes both walls meet the hole with its tangent
        # and curvature. Only after half the return is the full width reached.
        z=np.minimum(t/.5,1.)
        delta=offset*(10*z**3-15*z**4+6*z**5)
        ddelta=np.where(t<.5,offset*(30*z*z-60*z**3+30*z**4)/.5,0.)
        dddelta=np.where(t<.5,offset*(60*z-180*z*z+120*z**3)/.25,0.)
        theta_p=length*(1/hole.r+(1/upper.r-1/hole.r)*t)
        theta_pp=length*(1/upper.r-1/hole.r)
        A=length+delta*theta_p
        P=p-delta[...,None]*N
        D=A[...,None]*T-ddelta[...,None]*N
        DD=(2*ddelta*theta_p+delta*theta_pp)[...,None]*T+(A*theta_p-dddelta)[...,None]*N
        return P,D,DD
    knots=np.r_[np.zeros(4),np.linspace(0,1,parts+1)[1:-1],np.ones(4)]
    basis=BSpline(knots,np.eye(parts+3),3)
    constraints=np.vstack((basis(0),basis(0,1),basis(0,2),basis(1),basis(1,1),basis(1,2)))
    p,d,dd=actual(0.);q,e,ee=actual(1.)
    targets=np.array([p,d,dd,q,e,ee])
    fixed=np.linalg.lstsq(constraints,targets,rcond=None)[0];free=null_space(constraints)
    samples=np.linspace(0,1,721);ideal=actual(samples)[0];design=basis(samples)
    coefficients=fixed+free@np.linalg.lstsq(design@free,ideal-design@fixed,rcond=None)[0]
    spline=BSpline(knots,coefficients,3);curves=[]
    for i in range(parts):
        t0=i/parts;t1=(i+1)/parts;h=t1-t0
        a=spline(t0);b=spline(t1)
        curves.append(Cubic([a,a+h*spline(t0,1)/3,b-h*spline(t1,1)/3,b],'B1 Rücklauf'))
    error=max(np.linalg.norm(spline(samples)-ideal,axis=1))
    transition_stats.append(dict(name='B1 Rücklauf',cubics=parts,fit_error=float(error),rule='linear curvature, hole to upper circle'))
    assert error<.02,error
    return curves
lower_exit=75.
lower_tip=v([326.5449,861.8859])
tip_tangent=unit(math.radians(221.))

def quintic_points(s0,s1,speeds):
    p,T,k=s0;q,U,l=s1;L0,L1=speeds
    N=lambda t:v([-t[1],t[0]])
    points=np.array([p,p+L0*T/5,np.zeros(2),np.zeros(2),q-L1*U/5,q])
    points[2]=2*points[1]-points[0]+L0*L0*k*N(T)/20
    points[3]=2*points[4]-points[5]+L1*L1*l*N(U)/20
    return points

def bezier_values(points,t):
    t=np.asarray(t,dtype=float);degree=len(points)-1
    return np.stack([math.comb(degree,i)*(1-t)**(degree-i)*t**i for i in range(degree+1)],axis=-1)@points

def tail_wall(offset):
    radius=lower.r+offset/2
    centre=hole.c-(radius-hole.r)*unit(math.radians(hole_angle))
    return Circle(lower.name+('a' if offset>0 else 'b'),centre,radius,lower.label+' Kontur')

tail_pair_points=[quintic_points(tail_wall(off).state(lower_exit),(lower_tip,tip_tangent,0.),(290.*tail_wall(off).r/lower.r,285.)) for off in [half,-half]]
tail_mid_points=(tail_pair_points[0]+tail_pair_points[1])/2
tail_delta_points=(tail_pair_points[0]-tail_pair_points[1])/2
tail_optical_taper=.35
def tail_bridge(offset):
    sign=offset/half
    def actual(t):
        t=np.asarray(t,dtype=float)
        m=bezier_values(tail_mid_points,t);m1=bezier_values(5*np.diff(tail_mid_points,axis=0),t);m2=bezier_values(20*np.diff(tail_mid_points,n=2,axis=0),t)
        d=bezier_values(tail_delta_points,t);d1=bezier_values(5*np.diff(tail_delta_points,axis=0),t);d2=bezier_values(20*np.diff(tail_delta_points,n=2,axis=0),t)
        f=1-tail_optical_taper*(10*t**3-15*t**4+6*t**5)
        f1=-tail_optical_taper*(30*t*t-60*t**3+30*t**4)
        f2=-tail_optical_taper*(60*t-180*t*t+120*t**3)
        return m+sign*f[...,None]*d,m1+sign*(f1[...,None]*d+f[...,None]*d1),m2+sign*(f2[...,None]*d+2*f1[...,None]*d1+f[...,None]*d2)
    return fit_exact_curve(actual,'B5 Auslauf',parts=24)

def spiral_side(offset,mouth,top):
    big=Circle(upper.name+('a' if offset>0 else 'b'),upper.c,upper.r+offset,upper.label+' Kontur')
    wall_circles.append(big)
    s=spiral_bridge(offset)
    opening_start,opening_end,opening=opening_bridge(big,mouth)
    s.append(big.arc(upper_entry,opening_start))
    s+=opening
    s.append(mouth.arc(opening_end,48 if top else 64,-1))
    s+=blend(mouth.state(48 if top else 64,-1),outer.state(-8 if top else 3.3,-1 if top else 1),'B4 Lippen',speed=44 if top else 34,parts=8)
    return s

upper_side=spiral_side(half,mouthtop,True)
lower_side=spiral_side(-half,mouthbottom,False)
outer_arc=outer.arc(-8,3.3,-1)
base_d=path([outer_arc]+rev(lower_side)+upper_side,True)+' '+circle_path(hole)

def lower_slit_side(offset):
    wall=tail_wall(offset)
    if offset:wall_circles.append(wall)
    s=blend(hole.state(hole_angle),wall.state(hole_angle+16),'B2 Anschluss oben',speed=wall.r*math.radians(16),parts=6)
    s.append(wall.arc(hole_angle+16,lower_exit))
    s+=tail_bridge(offset)
    return s

slit_a=lower_slit_side(half);slit_b=lower_slit_side(-half)
slit_d=path(slit_a+rev(slit_b),True)
ink_d=base_d+' '+slit_d

def svg(body,box='144 132 960 960',width=960,height=960,title='ELANUM',desc=''):
    return f'<svg xmlns="{NS}" width="{width}" height="{height}" viewBox="{box}" role="img"><title>{title}</title><desc>{desc}</desc>{body}</svg>'
def write_svg(name,body,**kwargs):
    content=svg(body,**kwargs)
    if name!='ELANUM-Kontur-Geometrisch.svg':(OUT/NAMES.get(name,name)).write_text(content,encoding='utf-8')
    return content
limit_d=circle_path(outer)+' '+circle_path(hole)
def clip_def(identifier):return f'<defs><clipPath id="{identifier}"><path d="{limit_d}" clip-rule="evenodd"/></clipPath></defs>'
ink=write_svg('ELANUM-Ink-Geometrisch.svg',clip_def('elanum-limit')+f'<path d="{ink_d}" fill="{INK}" fill-rule="evenodd" clip-path="url(#elanum-limit)"/>',title='ELANUM: sechs Grundkreise',desc='Mantel, Zentrum, Oberbogen, Unterbogen und zwei Mündungskreise. Benannte Bézierbrücken verbinden die Bögen.')
contour=write_svg('ELANUM-Kontur-Geometrisch.svg',clip_def('contour-limit')+f'<path d="{ink_d}" fill="none" stroke="{INK}" stroke-width="1.2" clip-path="url(#contour-limit)"/>',title='ELANUM: vereinfachte Kontur')
original_root=ET.parse(OUT/'ELANUM-System-Ink-Curves.svg').getroot()
old_d=list(original_root)[-1].get('d')
compare=write_svg('ELANUM-Konturvergleich-Geometrisch.svg',clip_def('compare-limit')+f'<rect x="110" y="40" width="1120" height="1100" fill="{PAPER}"/><text x="155" y="85" font-family="sans-serif" font-size="24" fill="{INK}">ELANUM: vereinfachte Konstruktion</text><text x="155" y="117" font-family="sans-serif" font-size="17" fill="{INK}">Rose: gelieferte Curves-Version · Ink: sechs Grundkreise</text><path d="{old_d}" fill="none" stroke="{ROSE}" stroke-width="2" opacity=".8"/><path d="{ink_d}" fill="none" stroke="{INK}" stroke-width="1.2" clip-path="url(#compare-limit)"/>',box='110 40 1120 1100',width=1120,height=1100,title='ELANUM: Formvergleich')

# The colour surfaces use the very same return and lower sweep. Hidden
# closures use explicit Bezier bridges rather than two additional circles.
center_return=spiral_bridge(0.)
surface_start_top,surface_end_top,surface_bridge_top=opening_bridge(upper,mouthtop,'surface mouth upper')
surface_start_bottom,surface_end_bottom,surface_bridge_bottom=opening_bridge(upper,mouthbottom,'surface mouth lower')
center_upper=center_return+[upper.arc(upper_entry,surface_start_bottom)]
colour_end=v([1027.3,745.8]);colour_tangent=unit(math.radians(12.))
colour_right=blend(upper.state(surface_start_bottom),(colour_end,colour_tangent,0.),'F2 Farbfläche rechts',speed=(365.,345.),parts=10)
center_upper+=colour_right
center_lower=lower_slit_side(0.)
join_p,join_t,join_k=center_return[11].endpoint_state(True)
# This rear closure crosses underneath the band. Its incoming direction
# avoids an exposed U-turn outside the shared return boundary.
colour_left=blend((lower_tip,tip_tangent,0.),(join_p,unit(math.radians(-45.)),0.),'F1 Farbfläche links',speed=(260.,260.),parts=10)
front_d=path(center_lower+colour_left+rev(center_return[:12])+[hole.arc(0,hole_angle,-1)],True)
return_lower=lower.arc(344,hole_angle+16,-1)
band_d=path(center_upper)+f' L 835 796 L {fmt(return_lower.p)} '+return_lower.d()+' '+' '.join(s.d() for s in rev(center_lower[:6]))+' '+hole.arc(hole_angle,360).d()+' Z'
mouth_upper=surface_bridge_top+[mouthtop.arc(surface_end_top,48,-1)]+upper_side[-8:]
mouth_lower=surface_bridge_bottom+[mouthbottom.arc(surface_end_bottom,64,-1)]+lower_side[-8:]
tail_d=path(colour_right)+f' L 1400 800 L 1400 400 L {fmt(mouth_lower[-1].q)} '+' '.join(s.d() for s in rev(mouth_lower))+' Z'
surface_link_sense=1 if surface_start_top>surface_start_bottom else -1
spectrum_silhouette=path([outer_arc]+rev(mouth_lower)+[upper.arc(surface_start_bottom,surface_start_top,surface_link_sense)]+mouth_upper,True)+' '+circle_path(hole)
spectrum_root=ET.parse(OUT/'ELANUM-Master-Spektrum-Curves.svg').getroot()
clip_paths={'h-silhouette':spectrum_silhouette,'h-clip-base':spectrum_silhouette,'h-clip-front':front_d,'h-clip-band':band_d,'h-clip-tail':tail_d}
for e in spectrum_root.iter():
    if e.get('id') in clip_paths:e[0].set('d',clip_paths[e.get('id')])
    elif e.get('id')=='h-front-fade':
        # Fade the hidden rear closure before it reaches the shared return.
        # Preserve the original fade width and all radial colour fields.
        fade_start=math.ceil(join_p[0])
        e.set('x1',str(fade_start));e.set('x2',str(fade_start+140))
title=ET.Element(f'{{{NS}}}title');title.text='ELANUM: vereinfachtes Spektrum'
desc=ET.Element(f'{{{NS}}}desc');desc.text='Sechs Grundkreise. Benannte Bezierbrücken und übernommene Farbverläufe aus dem Master.'
spectrum_root.insert(0,desc);spectrum_root.insert(0,title)
spectrum_xml=ET.tostring(spectrum_root,encoding='unicode')
(OUT/'ELANUM-Master-Spektrum-Geometrisch.svg').write_text(spectrum_xml,encoding='utf-8')

circle_roles={
 'C1':('Mantel','Der Aussenkreis bestimmt die runde Grundform.','Mittelpunkt und Radius bleiben erhalten.'),
 'C2':('Zentrum','Der Lochkreis bestimmt die innere Öffnung.','P1 und P2 liegen exakt auf diesem Kreis.'),
 'C3':('Oberbogen','Bestimmt die Wölbung oberhalb des Zentrums.','B1 endet mit gleicher Tangente und Krümmung auf C3.'),
 'C4':('Unterbogen','Bestimmt den grossen Schwung unterhalb des Zentrums.','B5 führt zum Auslauf. Ein zweiter Unterkreis entfällt.'),
 'C5':('Mündung oben','Formt die Oberkante der rechten Öffnung.','B3 verbindet den Oberbogen mit dieser Mündung.'),
 'C6':('Mündung unten','Formt die Unterkante der rechten Öffnung.','Der Abstand zu C5 bestimmt die Weite der Öffnung.')
}
bridge_roles={
 'B1':('Rücklauf','P2 am Zentrum zu C3 Oberbogen.','Die Krümmung nimmt durchgehend und gleichmässig ab.'),
 'B2':('Anschluss oben','P1 am Zentrum zu C4 Unterbogen.','Ein kurzer Übergang öffnet die untere Aussparung.'),
 'B3':('Öffnung','C3 Oberbogen zu C5 und C6 Mündung.','Gleichmässiger Krümmungswechsel mit einem Wendepunkt.'),
 'B4':('Lippen','C5 und C6 Mündung zu C1 Mantel.','Rundet die beiden Enden der rechten Öffnung.'),
 'B5':('Auslauf','C4 Unterbogen zum linken Spaltende.','Die Spaltbreite nimmt durchgehend und früher ab.')
}
circle_offsets={'C1':(20,-16),'C2':(-3,31),'C3':(12,20),'C4':(12,25),'C5':(-14,-29),'C6':(19,11)}
circle_markup=[]
for c in circles:
 x,y=c.c;dx,dy=circle_offsets[c.name]
 circle_markup.append(f'<g data-circle="{c.name}"><circle cx="{x:.8f}" cy="{y:.8f}" r="{c.r:.8f}" fill="none" stroke="{BLUE}" stroke-width="1" stroke-dasharray="5 6" opacity=".5"/><path d="M {x-4:.8f} {y:.8f} h 8 M {x:.8f} {y-4:.8f} v 8" stroke="{BLUE}" stroke-width="1"/><text x="{x+dx:.6f}" y="{y+dy:.6f}" font-family="monospace" font-size="14" fill="{INK}">{c.name}</text></g>')
geometry_markup=''.join(circle_markup)
contacts=[('P1',hole.state(hole_angle)[0]),('P2',hole.state(0)[0])]
for label,p in contacts:
 geometry_markup+=f'<circle cx="{p[0]:.8f}" cy="{p[1]:.8f}" r="3.2" fill="{PAPER}" stroke="{BLUE}" stroke-width="1.3"/><text x="{p[0]+10:.6f}" y="{p[1]-9:.6f}" font-size="13" fill="{INK}" font-family="monospace">{label}</text>'
real_arcs=[];bridges=[];boundary_points=[]
for seq in [upper_side,lower_side,slit_a,slit_b]:
 for s in seq:
  colour=BLUE if isinstance(s,Arc) else ROSE
  mark=f'<path d="{path([s])}" fill="none" stroke="{colour}" stroke-width="1.6"/>'
  (real_arcs if isinstance(s,Arc) else bridges).append(mark)
 for a,b in zip(seq,seq[1:]):
  if isinstance(a,Arc)!=isinstance(b,Arc):boundary_points.append(f'<circle cx="{a.q[0]:.8f}" cy="{a.q[1]:.8f}" r="2.7" fill="{PAPER}" stroke="{ROSE}" stroke-width="1"/>')
bridge_labels=''
b3_label_segments=[s for s in upper_side if getattr(s,'group','')=='B3 Öffnung']
b5_label_segments=[s for s in slit_a if getattr(s,'group','')=='B5 Auslauf']
bridge_places=[('B1',280,697,center_return[12].p),('B2',525,480,slit_a[3].p),('B3',846,597,b3_label_segments[len(b3_label_segments)//2].p),('B4a',1120,540,upper_side[-3].p),('B4b',1120,651,lower_side[-3].p),('B5',377,974,b5_label_segments[len(b5_label_segments)//2].p)]
for name,x,y,p in bridge_places:
 bridge_labels+=f'<path d="M {x+15} {y-4} L {fmt(p)}" fill="none" stroke="{ROSE}" stroke-width=".7"/><text x="{x}" y="{y}" font-family="monospace" font-size="15" fill="{ROSE}">{name}</text>'
shape_markup=clip_def('blueprint-limit')+f'<path d="{ink_d}" fill="{INK}" fill-rule="evenodd" opacity=".045" clip-path="url(#blueprint-limit)"/><path d="{ink_d}" fill="none" stroke="{INK}" stroke-width="1" clip-path="url(#blueprint-limit)"/>'
active_markup=f'<g clip-path="url(#blueprint-limit)">{"".join(real_arcs)}{"".join(bridges)}{"".join(boundary_points)}</g>'
side=f'<text x="1280" y="180" font-size="24" fill="{INK}">Sechs Grundkreise</text>'
for i,c in enumerate(circles):
 y=225+i*65
 side+=f'<text x="1280" y="{y}" font-size="19" fill="{INK}">{c.name} {c.label}</text><text x="1280" y="{y+23}" font-family="monospace" font-size="14" fill="#5B6660">Radius {c.r:.3f}</text>'
side+=f'<path d="M 1280 635 h 34" stroke="{BLUE}" stroke-width="2"/><text x="1328" y="641" font-size="17" fill="{INK}">Echte Kreise und Kreisbögen</text><path d="M 1280 670 h 34" stroke="{ROSE}" stroke-width="2"/><text x="1328" y="676" font-size="17" fill="{INK}">Explizite Bézierbrücken</text><text x="1280" y="743" font-size="24" fill="{INK}">Fünf benannte Brücken</text>'
for i,(key,values) in enumerate(bridge_roles.items()):
 y=790+i*71
 side+=f'<text x="1280" y="{y}" font-size="19" fill="{INK}">{key} {values[0]}</text><text x="1280" y="{y+25}" font-size="15" fill="#5B6660">{values[1]}</text>'
side+=f'<text x="1280" y="1190" font-size="15" fill="#5B6660">B4a und B4b: obere und untere Lippe.</text>'
explanation=f'<text x="160" y="1255" font-size="26" fill="{INK}">Zuordnung für dein Feedback</text><text x="160" y="1290" font-size="17" fill="#5B6660">Zum Beispiel: «B1 näher ans Zentrum», «C4 weiter nach rechts» oder «Öffnung zwischen C5 und C6 breiter».</text>'
for i,c in enumerate(circles):
 x=160+(i%2)*845;y=1350+(i//2)*115
 title,line1,line2=circle_roles[c.name]
 explanation+=f'<text x="{x}" y="{y}" font-size="22" fill="{INK}">{c.name} {title}</text><text x="{x}" y="{y+31}" font-size="17" fill="#5B6660">{line1}</text><text x="{x}" y="{y+58}" font-size="17" fill="#5B6660">{line2}</text>'
explanation+=f'<text x="160" y="1740" font-size="17" fill="#5B6660">Keine versteckten Rücklauf- oder Auslaufkreise. Die feinen Spaltkonturen werden aus derselben Konstruktion abgeleitet.</text>'
blueprint_body=f'<rect x="100" y="20" width="1800" height="1770" fill="{PAPER}"/><g font-family="sans-serif"><text x="160" y="72" font-size="30" fill="{INK}">ELANUM: vereinfachte Konstruktion</text><text x="160" y="106" font-size="18" fill="#5B6660">Sechs Grundkreise, fünf benannte Brücken. Die Grundform bleibt die Referenz.</text></g>{shape_markup}{geometry_markup}{active_markup}{bridge_labels}<g font-family="sans-serif">{side}{explanation}</g>'
blueprint=write_svg('ELANUM-Blueprint-Geometrisch.svg',blueprint_body,box='100 20 1800 1770',width=1800,height=1770,title='ELANUM: sechs benannte Grundkreise und fünf Brücken')

detail_markup=clip_def('detail-limit')
for i,(label,box,origin,reference,captions) in enumerate([
 ('B3: Übergang zur Öffnung','720 445 250 230',[s for seq in [upper_side,lower_side] for s in seq if getattr(s,'group','')=='B3 Öffnung'],[upper,mouthtop,mouthbottom],('Gleichmässiger Wechsel von C3 zur Mündung.','Ein Wendepunkt, mit passender Tangente und Krümmung.')),
 ('B5: schlanker Auslauf','280 710 580 330',[s for seq in [slit_a,slit_b] for s in seq if getattr(s,'group','')=='B5 Auslauf'],[lower],('Die Spaltbreite nimmt vom Anschluss bis zur Spitze ab.','Beide Konturen folgen derselben Breitensteuerung.'))
]):
 x=55+i*680
 detail_markup+=f'<defs><clipPath id="detail-panel-{i}"><rect x="{x}" y="160" width="610" height="460"/></clipPath></defs>'
 guides=''.join(f'<circle cx="{c.c[0]}" cy="{c.c[1]}" r="{c.r}" fill="none" stroke="{BLUE}" stroke-width=".8" stroke-dasharray="4 5" opacity=".65"/>' for c in reference)
 for s in origin:guides+=f'<path d="{path([s])}" fill="none" stroke="{ROSE}" stroke-width=".9"/>'
 if i==0:
  for name,point in [('C3',origin[0].p),('C5',origin[11].q),('C6',origin[-1].q)]:guides+=f'<circle cx="{point[0]}" cy="{point[1]}" r="2.7" fill="{PAPER}" stroke="{BLUE}" stroke-width="1"/><text x="{point[0]+9}" y="{point[1]-8}" font-size="12" fill="{INK}">{name}</text>'
 detail_markup+=f'<text x="{x}" y="122" font-size="23" fill="{INK}">{label}</text><g clip-path="url(#detail-panel-{i})"><svg x="{x}" y="160" width="610" height="460" viewBox="{box}" overflow="hidden"><path d="{ink_d}" fill="{INK}" fill-rule="evenodd" opacity=".06" clip-path="url(#detail-limit)"/><path d="{ink_d}" fill="none" stroke="{INK}" stroke-width=".7" clip-path="url(#detail-limit)"/>{guides}</svg></g><text x="{x}" y="678" font-size="16" fill="#5B6660">{captions[0]}</text><text x="{x}" y="706" font-size="16" fill="#5B6660">{captions[1]}</text>'
detail_body=f'<rect width="1440" height="770" fill="{PAPER}"/><g font-family="sans-serif"><text x="55" y="57" font-size="29" fill="{INK}">ELANUM: B3 und B5 verfeinert</text>{detail_markup}</g>'
write_svg('ELANUM-Anschluesse-Detail.svg',detail_body,box='0 0 1440 770',width=1440,height=770,title='ELANUM: sauberer Krümmungswechsel und schlanker Auslauf')

# Check the actual unclipped contours, including all circle/Bezier joins and
# all four starts at the hole. The bridge B1 is compared with its exact rule.
errors=[];origins={}
for name,seq,start_angle,neck_count in [('upper',upper_side,0,24),('lower',lower_side,0,24),('slit_a',slit_a,hole_angle,6),('slit_b',slit_b,hole_angle,6),('colour_return',center_return,0,24),('colour_lower',center_lower,hole_angle,6)]:
 for a,b in zip(seq,seq[1:]):
  p,t,k=a.endpoint_state(True);q,u,l=b.endpoint_state(False)
  errors.append(dict(position=float(np.linalg.norm(p-q)),angle=float(math.degrees(math.acos(np.clip(np.dot(t,u),-1,1)))),curvature=abs(k-l)))
 p,t,k=hole.state(start_angle);q,u,l=seq[0].endpoint_state(False)
 errors.append(dict(position=float(np.linalg.norm(p-q)),angle=float(math.degrees(math.acos(np.clip(np.dot(t,u),-1,1)))),curvature=abs(k-l)))
 pp=[s.state(t)[0] for s in seq[:neck_count] for t in np.linspace(0,1,101)]
 origins[name]=min(float(np.linalg.norm(p-hole.c)-hole.r) for p in pp)
checks={'count':len(errors),'max_position_error':max(e['position'] for e in errors),'max_tangent_angle_degrees':max(e['angle'] for e in errors),'max_curvature_error':max(e['curvature'] for e in errors)}
assert checks['max_position_error']<1e-6,checks
assert checks['max_tangent_angle_degrees']<1e-4,checks
assert checks['max_curvature_error']<1e-7,checks
assert min(origins.values())>-1e-8,origins
# Inspect both full bridges, including the width measured along the normal
# of their common middle curve. Endpoint continuity alone misses the bumps.
b3_checks=[]
for name,sequence in [('upper',upper_side),('lower',lower_side)]:
    ss=[s for s in sequence if getattr(s,'group','')=='B3 Öffnung']
    kk=np.array([s.state(t)[2] for s in ss for t in np.linspace(0,1,101)])
    item=dict(contour=name,inflections=int(np.count_nonzero(kk[:-1]*kk[1:]<0)),max_curvature_increase=float(np.diff(kk).max()),start_curvature=float(kk[0]),end_curvature=float(kk[-1]))
    assert item['inflections']==1 and item['max_curvature_increase']<1e-8,item
    b3_checks.append(item)
tail_sequences=[[s for s in seq if getattr(s,'group','')=='B5 Auslauf'] for seq in [slit_a,slit_b]]
normal_widths=[]
for a,b in zip(*tail_sequences):
    mid=Cubic((a.points+b.points)/2)
    for t in np.linspace(0,1,101):
        delta=a.state(t)[0]-b.state(t)[0];T=mid.state(t)[1]
        normal_widths.append(abs(cross(T,delta)))
tail_checks=dict(start_width=normal_widths[0],maximum_width=max(normal_widths),end_width=normal_widths[-1],max_width_increase=float(np.diff(normal_widths).max()),midpoint_width=normal_widths[len(normal_widths)//2],optical_taper=tail_optical_taper)
assert tail_checks['max_width_increase']<1e-7,tail_checks
assert tail_checks['end_width']<1e-7,tail_checks
report={'construction_version':4,'circles':[dict(id=c.name,label=c.label,role=circle_roles[c.name][1],detail=circle_roles[c.name][2],cx=float(c.c[0]),cy=float(c.c[1]),radius=c.r) for c in circles], 'bridges':[dict(id=key,label=vv[0],connection=vv[1],rule=vv[2]) for key,vv in bridge_roles.items()], 'wall_circles':[dict(id=c.name,cx=float(c.c[0]),cy=float(c.c[1]),radius=c.r) for c in wall_circles], 'hole_contacts':[dict(id=n,x=float(p[0]),y=float(p[1])) for n,p in contacts], 'spiral_rule':{'length':spiral_length,'start_curvature':1/hole.r,'end_curvature':1/upper.r,'upper_entry_degrees':upper_entry,'width_fade_fraction':.5}, 'transitions':transition_stats,'join_checks':checks,'hole_origin_checks':origins,'b3_curvature_checks':b3_checks,'b3_solutions':b3_solutions,'b5_width_check':tail_checks,'paths':{'ink':ink_d,'base':base_d,'lower_slit':slit_d},'source':{'retained':'Outer circle, hole, mouth circles and main sweep positions reference the supplied SVGs.','removed':'Small return circle K3, lower continuation circle K8 and the two colour-only circles K9/K10.','colour':'Original radial gradients and lighting retained.'}}
(OUT/'ELANUM-Konstruktion-Geometrisch.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'circle_count':len(circles),'checks':checks,'b3':b3_checks,'b5':tail_checks},indent=2))

