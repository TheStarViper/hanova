import{$ as e,M as t,c as n,ot as r,s as i,st as a}from"./three.core-CsWurwAg.js";var o=class{parse(o){let s=``,c=0,l=0,u=0,d=new a,f=new i,p=new a,m=new r,h=[];function g(r){let i=0,a=0,o=0,g=r.geometry,_=new t,v=g.getAttribute(`position`),y=g.getAttribute(`normal`),b=g.getAttribute(`uv`),x=g.getAttribute(`color`),S=g.getIndex();if(s+=`o `+r.name+`
`,r.material&&r.material.name&&(s+=`usemtl `+r.material.name+`
`),v!==void 0)for(let t=0,a=v.count;t<a;t++,i++)d.fromBufferAttribute(v,t),d.applyMatrix4(r.matrixWorld),s+=`v `+d.x+` `+d.y+` `+d.z,x!==void 0&&(f.fromBufferAttribute(x,t),n.workingToColorSpace(f,e),s+=` `+f.r+` `+f.g+` `+f.b),s+=`
`;if(b!==void 0)for(let e=0,t=b.count;e<t;e++,o++)m.fromBufferAttribute(b,e),s+=`vt `+m.x+` `+m.y+`
`;if(y!==void 0){_.getNormalMatrix(r.matrixWorld);for(let e=0,t=y.count;e<t;e++,a++)p.fromBufferAttribute(y,e),p.applyMatrix3(_).normalize(),s+=`vn `+p.x+` `+p.y+` `+p.z+`
`}if(S!==null)for(let e=0,t=S.count;e<t;e+=3){for(let t=0;t<3;t++){let n=S.getX(e+t)+1;h[t]=c+n+(y||b?`/`+(b?l+n:``)+(y?`/`+(u+n):``):``)}s+=`f `+h.join(` `)+`
`}else for(let e=0,t=v.count;e<t;e+=3){for(let t=0;t<3;t++){let n=e+t+1;h[t]=c+n+(y||b?`/`+(b?l+n:``)+(y?`/`+(u+n):``):``)}s+=`f `+h.join(` `)+`
`}c+=i,l+=o,u+=a}function _(e){let t=0,n=e.geometry,r=e.type,i=n.getAttribute(`position`),a=n.getIndex();if(s+=`o `+e.name+`
`,i!==void 0)for(let n=0,r=i.count;n<r;n++,t++)d.fromBufferAttribute(i,n),d.applyMatrix4(e.matrixWorld),s+=`v `+d.x+` `+d.y+` `+d.z+`
`;if(r===`Line`){if(s+=`l `,a!==null)for(let e=0,t=a.count;e<t;e++){let t=a.getX(e)+1;s+=c+t+` `}else for(let e=1,t=i.count;e<=t;e++)s+=c+e+` `;s+=`
`}if(r===`LineSegments`){if(a!==null)for(let e=0,t=a.count-1;e<t;e+=2){let t=a.getX(e)+1,n=a.getX(e+1)+1;s+=`l `+(c+t)+` `+(c+n)+`
`}else for(let e=1,t=e+1,n=i.count;e<n;e+=2,t=e+1)s+=`l `+(c+e)+` `+(c+t)+`
`}c+=t}function v(t){let r=0,i=t.geometry,a=i.getAttribute(`position`),o=i.getAttribute(`color`);if(s+=`o `+t.name+`
`,a!==void 0){for(let i=0,c=a.count;i<c;i++,r++)d.fromBufferAttribute(a,i),d.applyMatrix4(t.matrixWorld),s+=`v `+d.x+` `+d.y+` `+d.z,o!==void 0&&(f.fromBufferAttribute(o,i),n.workingToColorSpace(f,e),s+=` `+f.r+` `+f.g+` `+f.b),s+=`
`;s+=`p `;for(let e=1,t=a.count;e<=t;e++)s+=c+e+` `;s+=`
`}c+=r}return o.traverse(function(e){e.isMesh===!0&&g(e),e.isLine===!0&&_(e),e.isPoints===!0&&v(e)}),s}};export{o as OBJExporter};