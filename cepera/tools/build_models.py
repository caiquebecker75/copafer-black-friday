"""Gera os modelos 3D conceituais (GLB) do Módulo de Ocasião Cepêra.
Volumetria para discussão: medidas, materiais e carga dependem de levantamento.
Uso: python3 tools/build_models.py   (a partir de /cepera)"""
import json, struct, io, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, *p)
FONT = A('assets/fonts/BigShouldersDisplay-500-latin.woff2')
FTXT = A('assets/fonts/Outfit-300-latin.woff2')

def font(path, size, w):
    f = ImageFont.truetype(path, size)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f

GREEN=(61,31,12); GREEN2=(92,50,20); YEL=(255,210,31); CREAM=(254,245,168); BROWN=(74,40,22); ORANGE=(239,63,15)

# ---------- texturas ----------
def tex_header():
    W,H=1400,800; im=Image.new('RGB',(W,H),GREEN); d=ImageDraw.Draw(im)
    for i,r in enumerate(range(900,100,-70)):
        d.ellipse((W-520-r, H/2-r, W-520+r, H/2+r), outline=(80,42,16) if i%2 else (70,36,14), width=26)
    logo=Image.open(A('assets/brand/cep-logo.png')).convert('RGBA'); logo.thumbnail((300,140)); im.paste(logo,(70,60),logo)
    f1=font(FONT,150,900); f2=font(FTXT,40,500)
    d.text((70,270),'VAI COM O QUE',font=f1,fill=CREAM); d.text((70,430),'VOCÊ LEVA.',font=f1,fill=YEL)
    d.text((76,680),'Mostarda com Mel  ·  conceito para validação',font=f2,fill=CREAM)
    p=Image.open(A('assets/images/cep-mostarda-com-mel-400g-sabores-cepera-1-768x1024.webp')).convert('RGBA'); p.thumbnail((470,720))
    im.paste(p,(W-430,50),p); return im

def tex_cartela():
    W,H=600,1200; im=Image.new('RGB',(W,H),YEL); d=ImageDraw.Draw(im)
    ph=Image.open(A('assets/images/cep-home-ms-mostarda-mel-1-768x1152.webp')).convert('RGB')
    ph=ph.resize((W, int(ph.height*W/ph.width))).crop((0,0,W,760)); im.paste(ph,(0,0))
    f=font(FONT,78,900)
    for i,t in enumerate(['VAI COM A SALADA','QUE VOCÊ ESTÁ','COMPRANDO.']): d.text((40,790+i*96),t,font=f,fill=GREEN)
    d.rectangle((0,H-40,W,H),fill=GREEN); return im

def tex_label():
    W,H=1024,512; im=Image.new('RGB',(W,H),YEL); d=ImageDraw.Draw(im)
    d.rectangle((0,70,W,440),fill=BROWN)
    f=font(FONT,150,900)
    for x0 in (60,):
        d.text((x0+150,90),'MOSTARDA',font=f,fill=(250,240,220)); d.text((x0+150,250),'COM MEL',font=f,fill=YEL)
    return im

def tex_id():
    im=Image.new('RGB',(256,256),(255,255,255)); d=ImageDraw.Draw(im)
    rng=np.random.default_rng(7); n=21; s=200//n
    for y in range(n):
        for x in range(n):
            fin=(x<7 and y<7) or (x>=n-7 and y<7) or (x<7 and y>=n-7)
            if fin:
                cx,cy=(x%14 if x<7 else x-(n-7)), (y if y<7 else y-(n-7))
                on = cx in (0,6) or cy in (0,6) or (2<=cx<=4 and 2<=cy<=4)
            else: on = rng.random()<0.45
            if on: d.rectangle((28+x*s,28+y*s,28+x*s+s-1,28+y*s+s-1),fill=(0,0,0))
    return im

def tex_stopper():
    W,H=700,500; im=Image.new('RGB',(W,H),YEL); d=ImageDraw.Draw(im)
    f=font(FONT,120,900); d.text((40,60),'VAI COM',font=f,fill=GREEN); d.text((40,190),'O SEU',font=f,fill=GREEN); d.text((40,320),'SANDUÍCHE.',font=f,fill=ORANGE)
    return im

def jpg(im,q=82):
    b=io.BytesIO(); im.convert('RGB').save(b,'JPEG',quality=q,optimize=True); return b.getvalue()

# ---------- geometria ----------
class Scene:
    def __init__(s): s.groups={}  # matkey -> lists
    def add(s, mat, pos, nrm, uv, idx):
        g=s.groups.setdefault(mat,{'p':[],'n':[],'u':[],'i':[],'c':0})
        g['p'].append(pos); g['n'].append(nrm); g['u'].append(uv); g['i'].append(idx+g['c']); g['c']+=len(pos)

def quad(c, ux, uy, n):
    c=np.array(c,float); ux=np.array(ux,float); uy=np.array(uy,float)
    p=np.array([c-ux-uy, c+ux-uy, c+ux+uy, c-ux+uy]); nn=np.tile(n,(4,1)).astype(float)
    uv=np.array([[0,1],[1,1],[1,0],[0,0]],float); i=np.array([0,1,2,0,2,3])
    return p,nn,uv,i

def box(sc, mat, x0,y0,z0, x1,y1,z1, front=None):
    cx,cy,cz=(x0+x1)/2,(y0+y1)/2,(z0+z1)/2; hx,hy,hz=(x1-x0)/2,(y1-y0)/2,(z1-z0)/2
    faces=[((cx,cy,z1),(hx,0,0),(0,hy,0),(0,0,1),'f'),((cx,cy,z0),(-hx,0,0),(0,hy,0),(0,0,-1),'b'),
           ((x1,cy,cz),(0,0,-hz),(0,hy,0),(1,0,0),'r'),((x0,cy,cz),(0,0,hz),(0,hy,0),(-1,0,0),'l'),
           ((cx,y1,cz),(hx,0,0),(0,0,-hz),(0,1,0),'t'),((cx,y0,cz),(hx,0,0),(0,0,hz),(0,-1,0),'d')]
    for c,ux,uy,n,k in faces:
        m = (front or {}).get(k, mat)
        sc.add(m,*quad(c,ux,uy,n))

def cyl(sc, mat, cx,cz, y0,y1, r, seg=14, side_mat=None):
    a=np.linspace(0,2*math.pi,seg+1)
    x=cx+r*np.sin(a); z=cz+r*np.cos(a)
    p=[];n=[];u=[];idx=[]
    for k in range(seg+1):
        p+= [[x[k],y0,z[k]],[x[k],y1,z[k]]]; nn=[math.sin(a[k]),0,math.cos(a[k])]; n+=[nn,nn]
        uu=k/seg; u+=[[uu,1],[uu,0]]
    for k in range(seg): b=2*k; idx+=[b,b+2,b+1,b+1,b+2,b+3]
    sc.add(side_mat or mat,np.array(p),np.array(n,float),np.array(u,float),np.array(idx))
    for yy,ny in ((y1,1),(y0,-1)):
        p=[[cx,yy,cz]]+[[x[k],yy,z[k]] for k in range(seg)]; n=[[0,ny,0]]*(seg+1); u=[[.5,.5]]*(seg+1)
        idx=[]
        for k in range(seg):
            a1,b1=1+k,1+(k+1)%seg; idx+= [0,a1,b1] if ny>0 else [0,b1,a1]
        sc.add(mat,np.array(p,float),np.array(n,float),np.array(u,float),np.array(idx))

def bottle(sc, cx, y, cz, s=1.0):
    # frasco squeeze invertido: tampa embaixo
    cyl(sc,'cap',cx,cz,y,y+0.03*s,0.028*s)
    cyl(sc,'yel',cx,cz,y+0.03*s,y+0.06*s,0.036*s)
    cyl(sc,'yel',cx,cz,y+0.06*s,y+0.19*s,0.040*s,side_mat='label')
    cyl(sc,'yel',cx,cz,y+0.19*s,y+0.205*s,0.036*s)

MATS={
 'green':{'c':(61,31,12),'r':.55},'green2':{'c':(92,50,20),'r':.5},'cream':{'c':(254,245,200),'r':.6},
 'yel':{'c':(255,210,31),'r':.35},'cap':{'c':(245,245,240),'r':.4},'grey':{'c':(170,172,168),'r':.5,'m':.4},
 'dark':{'c':(30,34,30),'r':.6},'white':{'c':(250,250,250),'r':.5},'orange':{'c':(239,63,15),'r':.5},
 'header':{'t':'header'},'cartela':{'t':'cartela'},'label':{'t':'label'},'id':{'t':'id'},'stopper':{'t':'stopper'},
}

def shelf_row(sc, x0, x1, y, z0, z1, rows=1, s=1.0):
    box(sc,'cream',x0,y,z0,x1,y+0.018,z1)
    box(sc,'yel',x0,y-0.03,z1,x1,y+0.03,z1+0.012)          # régua / porta-preço
    for k in range(max(1,int((x1-x0)/0.12))):              # etiquetas de preço
        pass
    tx=x0+0.05; box(sc,'white',tx,y-0.022,z1+0.012,tx+0.07,y+0.022,z1+0.016)
    n=int((x1-x0-0.04)/(0.092*s)); dx=(x1-x0)/n
    for r in range(rows):
        zz=z1-0.06-r*0.095*s
        if zz< z0+0.04: break
        for k in range(n): bottle(sc,x0+dx*(k+.5),y+0.018,zz,s)

def module_A(sc):
    W,D=0.72,0.46; x0,x1=-W/2,W/2
    box(sc,'dark',x0+0.02,0,-D/2+0.02,x1-0.02,0.05,D/2-0.02)
    box(sc,'green',x0,0.05,-D/2,x1,0.14,D/2)
    box(sc,'green',x0,0.14,-D/2,x1,1.42,-D/2+0.02)                        # fundo
    box(sc,'green',x0,0.14,-D/2,x0+0.022,1.42,D/2,front={'l':'cartela'}) # lateral c/ cartela de ocasião
    box(sc,'green',x1-0.022,0.14,-D/2,x1,1.42,D/2)
    box(sc,'white',x1,0.20,0.10,x1+0.002,0.30,0.20,front={'r':'id'})      # ID individual do material
    for y in (0.14,0.44,0.74,1.04): shelf_row(sc,x0+0.022,x1-0.022,y,-D/2+0.02,D/2-0.02,rows=3)
    box(sc,'green',x0,1.42,-D/2,x1,1.44,D/2)
    box(sc,'green2',x0-0.01,1.44,-0.03,x1+0.01,1.86,0.0,front={'f':'header'})  # testeira intercambiável
    box(sc,'yel',x0-0.01,1.44,0.0,x1+0.01,1.455,0.004)

def module_B(sc):
    W,D=0.50,0.34; x0,x1=-W/2,W/2
    box(sc,'green',x0,0,-D/2,x1,0.10,D/2)
    box(sc,'green',x0,0.10,-D/2,x1,1.12,-D/2+0.02)
    box(sc,'green',x0,0.10,-D/2,x0+0.02,1.12,D/2,front={'l':'cartela'})
    box(sc,'green',x1-0.02,0.10,-D/2,x1,1.12,D/2)
    box(sc,'white',x1,0.16,0.04,x1+0.002,0.24,0.12,front={'r':'id'})
    for y in (0.10,0.44,0.78): shelf_row(sc,x0+0.02,x1-0.02,y,-D/2+0.02,D/2-0.02,rows=2)
    box(sc,'green',x0,1.12,-D/2,x1,1.14,D/2)
    box(sc,'green2',x0,1.14,-0.03,x1,1.42,0.0,front={'f':'header'})

def module_C(sc):
    # kit de gôndola: trecho de gôndola existente (cinza) + régua, porta-preço, stopper e cartela
    W,D=1.0,0.50; x0,x1=-W/2,W/2
    box(sc,'grey',x0,0,-D/2,x1,0.12,D/2)
    box(sc,'grey',x0,0.12,-D/2,x1,1.60,-D/2+0.04)
    for y in (0.12,0.50,0.88,1.26):
        box(sc,'grey',x0,y,-D/2+0.04,x1,y+0.02,D/2-0.04)
    for y in (0.50,0.88):
        shelf_row(sc,x0+0.30,x1-0.02,y,-D/2+0.04,D/2-0.04,rows=3)
        box(sc,'yel',x0,y-0.03,D/2-0.04,x1,y+0.03,D/2-0.028)   # faixa/régua de gôndola em toda a extensão
    box(sc,'white',x0+0.06,0.62,-D/2+0.041,x0+0.26,1.02,-D/2+0.043,front={'f':'cartela'})
    box(sc,'white',x1-0.02,0.95,D/2-0.04,x1-0.016,1.20,D/2+0.30,front={'r':'stopper','l':'stopper'})  # stopper
    box(sc,'white',x1,0.20,0.0,x1+0.002,0.28,0.08,front={'r':'id'})

# ---------- GLB ----------
def write_glb(sc, path, textures):
    bin_=bytearray(); bviews=[]; accs=[]; meshes_prims=[]; mats=[]; matidx={}; images=[]; texs=[]; timg={}
    def view(data, target=None):
        while len(bin_)%4: bin_.append(0)
        off=len(bin_); bin_.extend(data); v={'buffer':0,'byteOffset':off,'byteLength':len(data)}
        if target: v['target']=target
        bviews.append(v); return len(bviews)-1
    def mat(k):
        if k in matidx: return matidx[k]
        m=MATS[k]; pbr={'metallicFactor':m.get('m',0.0),'roughnessFactor':m.get('r',.6)}
        if 't' in m:
            t=m['t']
            if t not in timg:
                bv=view(textures[t]); images.append({'bufferView':bv,'mimeType':'image/jpeg'}); texs.append({'source':len(images)-1,'sampler':0}); timg[t]=len(texs)-1
            pbr['baseColorTexture']={'index':timg[t]}; pbr['roughnessFactor']=.55
        else:
            pbr['baseColorFactor']=[ (c/255)**2.2 for c in m['c']]+[1.0]
        mats.append({'name':k,'pbrMetallicRoughness':pbr}); matidx[k]=len(mats)-1; return matidx[k]
    for k,g in sc.groups.items():
        P=np.concatenate(g['p']).astype(np.float32); N=np.concatenate(g['n']).astype(np.float32); U=np.concatenate(g['u']).astype(np.float32); I=np.concatenate(g['i']).astype(np.uint32)
        N/=np.linalg.norm(N,axis=1,keepdims=True)
        a={}
        for nm,arr,typ in (('POSITION',P,'VEC3'),('NORMAL',N,'VEC3'),('TEXCOORD_0',U,'VEC2')):
            bv=view(arr.tobytes(),34962); acc={'bufferView':bv,'componentType':5126,'count':len(arr),'type':typ}
            if nm=='POSITION': acc['min']=P.min(0).tolist(); acc['max']=P.max(0).tolist()
            accs.append(acc); a[nm]=len(accs)-1
        bv=view(I.tobytes(),34963); accs.append({'bufferView':bv,'componentType':5125,'count':len(I),'type':'SCALAR'})
        meshes_prims.append({'attributes':a,'indices':len(accs)-1,'material':mat(k)})
    while len(bin_)%4: bin_.append(0)
    gl={'asset':{'version':'2.0','generator':'75LAB build_models.py'},'scene':0,'scenes':[{'nodes':[0]}],
        'nodes':[{'mesh':0,'name':'modulo'}],'meshes':[{'primitives':meshes_prims}],'materials':mats,
        'accessors':accs,'bufferViews':bviews,'buffers':[{'byteLength':len(bin_)}]}
    if images: gl['images']=images; gl['textures']=texs; gl['samplers']=[{'magFilter':9729,'minFilter':9987,'wrapS':33071,'wrapT':33071}]
    js=json.dumps(gl,separators=(',',':')).encode()
    while len(js)%4: js+=b' '
    total=12+8+len(js)+8+len(bin_)
    with open(path,'wb') as f:
        f.write(struct.pack('<III',0x46546C67,2,total)); f.write(struct.pack('<II',len(js),0x4E4F534A)); f.write(js)
        f.write(struct.pack('<II',len(bin_),0x004E4942)); f.write(bin_)
    return total

if __name__=='__main__':
    T={'header':jpg(tex_header()),'cartela':jpg(tex_cartela()),'label':jpg(tex_label(),78),'id':jpg(tex_id(),90),'stopper':jpg(tex_stopper())}
    tex_header().save(A('assets/images/conceito-testeira.jpg'),quality=84)
    pass
    for name,fn in (('modulo-a-experiencia',module_A),('modulo-b-presenca',module_B),('modulo-c-essencial',module_C)):
        sc=Scene(); fn(sc); n=write_glb(sc,A('assets/models',name+'.glb'),T); print(name,n//1024,'KB')
