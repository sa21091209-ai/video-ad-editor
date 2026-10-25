import numpy as np, wave, sys
sr=48000; D=24.0; n=int(sr*D); out=np.zeros(n)
rng=np.random.default_rng(7)
t=np.arange(n)/sr
# soft pad: Dm-ish chord with slow swell
for f,a in [(146.83,.05),(220.0,.035),(293.66,.03),(349.23,.02)]:
    out+=a*np.sin(2*np.pi*f*t+np.sin(2*np.pi*.15*t))*(0.6+0.4*np.sin(2*np.pi*t/8))
fade=np.minimum(1,t/1.5)*np.minimum(1,(D-t)/2.0); out*=fade
def whoosh(at,dur=.55,g=.35):
    m=int(dur*sr); s=int(at*sr); x=rng.standard_normal(m)
    env=np.sin(np.pi*np.linspace(0,1,m))**2
    # crude lowpass sweep via moving average of varying width
    y=np.convolve(x,np.ones(12)/12,'same')
    out[s:s+m]+=g*y*env
def hit(at,g=.6):
    m=int(.7*sr); s=int(at*sr); tt=np.arange(m)/sr
    y=np.sin(2*np.pi*(55+90*np.exp(-tt*30))*tt)*np.exp(-tt*6)
    y+=.25*rng.standard_normal(m)*np.exp(-tt*40)
    out[s:s+m]+=g*y
def pop(at,g=.25):
    m=int(.12*sr); s=int(at*sr); tt=np.arange(m)/sr
    out[s:s+m]+=g*np.sin(2*np.pi*880*tt*(1+3*tt))*np.exp(-tt*35)
def riser(at,dur=1.2,g=.25):
    m=int(dur*sr); s=int(at*sr); tt=np.arange(m)/sr
    x=np.convolve(rng.standard_normal(m),np.ones(6)/6,'same')
    out[s:s+m]+=g*x*(tt/dur)**2
for a in [0.0,3.0,12.8,18.9]: whoosh(a)
for a in [0.35,9.2,19.3]: hit(a)
for a in [0.9,1.4,1.9,2.4,9.9,10.6,11.3]: pop(a)
riser(8.0)
out=np.clip(out/np.max(np.abs(out))*0.8,-1,1)
st=np.stack([out,out],1); pcm=(st*32767).astype('<i2')
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes()); w.close()
