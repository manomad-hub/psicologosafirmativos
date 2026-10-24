
const NIVELES=[
 {n:0,titulo:"Para aparecer",sub:"Sin esto no hay ficha",color:"var(--gris)",tareas:[
  ["Envía tu nº de colegiado/a y tu colegio","Lo comprobamos nosotros en la ventanilla única del colegio. <b>Entregas:</b> nº y colegio."],
  ["Acredita tu habilitación sanitaria (si haces terapia como sanitario)","<b>Entregas:</b> título del Máster en Psicología General Sanitaria o la habilitación, y la autorización del centro si aplica. Si no la tienes, marca esta tarea al confirmar qué puedes y qué no puedes hacer, para que se diga en tu ficha."],
  ["Firma el compromiso anticonversión","Los 8 puntos, como declaración responsable. <b>Entregas:</b> el compromiso firmado."],
  ["Firma la declaración de no tener expediente ni sanción","Deontológica o administrativa por estos hechos, con permiso para preguntarlo a tu colegio. <b>Entregas:</b> la declaración firmada."],
  ["Envía tu seguro de responsabilidad civil en vigor","<b>Entregas:</b> certificado o póliza con la fecha de vigencia."]]},
 {n:1,titulo:"Verificado por la comunidad",sub:"Las 5 + 5",color:"var(--azul)",tareas:[
  ["Consigue 5 recomendaciones de psicólogos colegiados","De la red o LGTB, distintos entre sí, sin vínculo laboral ni de pareja contigo y sin recomendaros en círculo. Cada una responde a: «¿has visto su trabajo con personas LGTBIQ+? ¿cómo?». <b>Entregas:</b> los 5 nombres y nº de colegiado; ellos contestan a la asociación."],
  ["Enlaza 5 reseñas verificables de pacientes","En una plataforma con reseña ligada a cita real (Doctoralia, Google, TopDoctors…). Nunca con datos del paciente y sin pedirlas por tema. <b>Entregas:</b> los 5 enlaces."]]},
 {n:2,titulo:"Verificado en la práctica",sub:"Lo que de verdad distingue",color:"var(--mag)",tareas:[
  ["Envía la lista de tu huella pública","Web, redes, artículos y cursos que impartes. Un verificador la revisa con una lista escrita de señales rojas y apunta la fecha. <b>Entregas:</b> los enlaces."],
  ["Haz la entrevista con casos difíciles","Dos verificadores te plantean 2-3 casos inventados y puntúan con una rúbrica común. <b>Entregas:</b> pides cita y la haces.",1],
  ["Acredita formación en práctica afirmativa","<b>Entregas:</b> certificados con horas y entidad."],
  ["Comparte cómo lo dices en tu consulta","<b>Entregas:</b> tu consentimiento informado o la página de tu web donde explicas cómo trabajas con orientación e identidad."]]},
 {n:3,titulo:"Verificación continua",sub:"Para mantener la insignia",color:"var(--navy)",tareas:[
  ["Completa la renovación anual","Se recomprueban colegiación y huella pública y vuelves a firmar el compromiso. <b>Entregas:</b> lo mismo que al entrar, actualizado."],
  ["Muestra el canal de quejas en tu ficha y en tu web","<b>Entregas:</b> el enlace donde lo has puesto."],
  ["Activa la encuesta anónima a tus pacientes","Una o dos preguntas desde la web de la asociación. <b>Entregas:</b> tu alta en la encuesta.",2],
  ["Haz una supervisión o intervisión al año con otro miembro","Apuntada, sin datos de pacientes. <b>Entregas:</b> fecha y nombre del compañero/a."],
  ["Cumple 12 meses en la red sin quejas fundadas","Se marca sola al año de entrar si no hay ninguna queja considerada fundada. <b>Entregas:</b> nada; lo apunta la asociación."]]}
];
const CLAVE="pa-checklist-v0";
let est={};try{est=JSON.parse(localStorage.getItem(CLAVE))||{}}catch(e){}
const guardar=()=>{try{localStorage.setItem(CLAVE,JSON.stringify(est))}catch(e){}};
let id=0,total=0;
document.getElementById("lista").innerHTML=NIVELES.map(nv=>`<section class="nivel"><header style="background:${nv.color}"><b>${nv.n}</b><div><h2>${nv.titulo}</h2><small>${nv.sub}</small></div><span class="cuenta" id="c${nv.n}"></span></header>${nv.tareas.map(([t,e,f])=>{id++;total++;return `<label class="tarea" data-n="${nv.n}"><input type="checkbox" id="t${id}"><div><div class="t">${id}. ${t}${f==1?'<span class="tag">la prueba más fuerte</span>':''}${f==2?'<span class="tag prox">cuando esté disponible</span>':''}</div><div class="e">${e}</div></div></label>`}).join("")}</section>`).join("");
const cajas=[...document.querySelectorAll(".tarea input")];
["nombre","coleg"].forEach(k=>{const i=document.getElementById(k);i.value=est[k]||"";i.oninput=()=>{est[k]=i.value;guardar()}});
cajas.forEach(c=>{c.checked=!!est[c.id];c.onchange=()=>{est[c.id]=c.checked;guardar();pinta()}});
function pinta(){
  const hechas=cajas.filter(c=>c.checked).length,p=Math.round(hechas*100/total);
  document.getElementById("pct").textContent=p+" %";
  document.getElementById("resumen").textContent=`${hechas} de ${total} tareas`;
  document.getElementById("barra").style.width=p+"%";
  document.getElementById("insignias").innerHTML=NIVELES.map(nv=>{
    const cs=cajas.filter(c=>c.closest(".tarea").dataset.n==nv.n),h=cs.filter(c=>c.checked).length;
    document.getElementById("c"+nv.n).textContent=`${h}/${cs.length}`;
    return `<span class="ins ${h==cs.length?'ok':''}">Nivel ${nv.n} ${h==cs.length?'✓ completo':h+'/'+cs.length}</span>`}).join("");
  cajas.forEach(c=>c.closest(".tarea").classList.toggle("hecha",c.checked));
}
function borrar(){if(confirm("¿Borrar todo lo marcado?")){est={};guardar();location.reload()}}
pinta();

document.getElementById("b-imprimir").onclick=()=>print();document.getElementById("b-borrar").onclick=borrar;
