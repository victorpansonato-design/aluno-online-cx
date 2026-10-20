import { useState, type ChangeEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
   ArrowRight,
   Award,
   Camera,
   CheckCircle2,
   FileCheck2,
   FileText,
   GraduationCap,
   Mail,
   MapPin,
   Pencil,
   Phone,
   ShieldCheck,
   Upload,
   UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { documentTypes } from "./data";
import { useDemo } from "./state";
import { Callout, DocButton, Modal, NextLink, Pill, Related, RowLink, SectionHead, downloadDocument } from "./ui";

export default function Personal() {
   const path = useLocation().pathname;
   if (path.endsWith("/documentos")) return <Documents />;
   if (path.endsWith("/carteirinha")) return <StudentCard />;
   if (path.endsWith("/certificados")) return <Certificates />;
   if (path.endsWith("/preferencias")) return <Preferences />;
   return <Profile />;
}

function Profile() {
   const { state, update } = useDemo();
   const [edit, setEdit] = useState(false);
   const [form, setForm] = useState({ ...state.profile });
   return (
      <>
         <section className="profile-cover">
            <span className="large-avatar">
               {state.profile.name
                  .split(" ")
                  .map(n => n[0])
                  .slice(0, 2)
                  .join("")}
            </span>
            <div>
               <h2>{state.profile.name}</h2>
               <p>Ciências Contábeis · 2º período</p>
               <span>RA demonstrativo: 20260001 · Ingresso em 2026</span>
            </div>
            <Link to="/meus-dados/carteirinha" className="button secondary">
               <UserRound size={17} />
               Minha carteirinha
            </Link>
         </section>
         <div className="columns">
            <section className="panel">
               <SectionHead title="Dados de contato">
                  <p>Use apenas informações fictícias nesta demonstração.</p>
               </SectionHead>
               <dl className="profile-fields">
                  <div>
                     <dt>
                        <Mail size={17} />
                        E-mail
                     </dt>
                     <dd>{state.profile.email}</dd>
                  </div>
                  <div>
                     <dt>
                        <Phone size={17} />
                        Celular
                     </dt>
                     <dd>{state.profile.phone}</dd>
                  </div>
                  <div>
                     <dt>
                        <MapPin size={17} />
                        Endereço
                     </dt>
                     <dd>{state.profile.address}</dd>
                  </div>
               </dl>
               <button
                  className="button secondary"
                  onClick={() => {
                     setForm({ ...state.profile });
                     setEdit(true);
                  }}
               >
                  <Pencil size={16} />
                  Editar dados de exemplo
               </button>
            </section>
            <section className="panel">
               <SectionHead title="Tudo o que é seu" />
               <RowLink
                  to="/meus-dados/documentos"
                  title="Meus documentos de matrícula"
                  description="Envie e acompanhe a conferência."
                  icon={<FileText size={20} />}
                  badge={<Pill tone="amber">{6 - Object.values(state.docs).filter(d => d.status !== "Reenviar").length} para enviar</Pill>}
               />
               <RowLink
                  to="/meus-dados/certificados"
                  title="Meus certificados"
                  description="Suas atividades e conquistas."
                  icon={<Award size={20} />}
               />
               <RowLink
                  to="/meus-dados/preferencias"
                  title="Preferências"
                  description="Tema, leitura e recursos de acessibilidade."
                  icon={<ShieldCheck size={20} />}
               />
               <RowLink
                  to="/secretaria/contratos"
                  title="Meus contratos"
                  description="Consulte e acompanhe na secretaria."
                  icon={<FileCheck2 size={20} />}
               />
            </section>
         </div>
         <Related
            items={[
               { to: "/secretaria/servicos/CSA_124", title: "Quero solicitar uso de nome social" },
               { to: "/academico", title: "Consultar minha vida acadêmica" },
            ]}
         />
         <Modal
            open={edit}
            onClose={() => setEdit(false)}
            title="Editar dados de exemplo"
            description="Alterações são salvas somente neste navegador. Use dados fictícios."
         >
            <form
               className="form-stack"
               onSubmit={e => {
                  e.preventDefault();
                  update(s => ({ ...s, profile: form }));
                  setEdit(false);
                  toast.success("Dados de exemplo atualizados");
               }}
            >
               <label>
                  Nome para exibição
                  <input
                     required
                     minLength={2}
                     maxLength={100}
                     value={form.name}
                     onChange={e => setForm({ ...form, name: e.target.value })}
                  />
               </label>
               <label>
                  E-mail
                  <input
                     type="email"
                     required
                     maxLength={120}
                     value={form.email}
                     onChange={e => setForm({ ...form, email: e.target.value })}
                  />
               </label>
               <label>
                  Celular
                  <input
                     type="tel"
                     required
                     minLength={8}
                     maxLength={25}
                     value={form.phone}
                     onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
               </label>
               <label>
                  Endereço
                  <input required maxLength={200} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
               </label>
               <div className="actions">
                  <button type="button" className="button secondary" onClick={() => setEdit(false)}>
                     Cancelar
                  </button>
                  <button className="button primary">Salvar dados de exemplo</button>
               </div>
            </form>
         </Modal>
      </>
   );
}

function Documents() {
   const { state, update } = useDemo();
   const [selected, setSelected] = useState<string | null>(null);
   const [file, setFile] = useState<File | null>(null);
   const [error, setError] = useState("");
   const [saving, setSaving] = useState(false);
   const active = documentTypes.find(d => d.id === selected);
   const sent = Object.values(state.docs).filter(d => d.status !== "Reenviar").length;
   const validated = Object.values(state.docs).filter(d => d.status === "Validado").length;
   const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
      const candidate = e.target.files?.[0];
      setError("");
      setFile(null);
      if (!candidate) return;
      if (!/\.(pdf|jpe?g|png)$/i.test(candidate.name)) {
         setError("Escolha um arquivo PDF, JPG ou PNG.");
         e.target.value = "";
         return;
      }
      if (candidate.size > 10 * 1024 * 1024) {
         setError("O arquivo ultrapassa 10 MB. Escolha uma versão menor.");
         e.target.value = "";
         return;
      }
      setFile(candidate);
   };
   const save = () => {
      if (!active || !file || saving) return;
      setSaving(true);
      update(s => ({ ...s, docs: { ...s.docs, [active.id]: { name: file.name, status: "Em conferência" } } }));
      setSelected(null);
      setFile(null);
      setSaving(false);
      toast.success("Envio simulado. O arquivo não foi enviado nem armazenado.");
   };
   return (
      <>
         <div className="context-banner">
            <FileText size={27} />
            <div>
               <strong>Seus documentos pessoais ficam aqui.</strong>
               <p>Para pedir uma declaração emitida pela faculdade, use a Secretaria virtual.</p>
            </div>
            <NextLink to="/secretaria/servicos?categoria=Declarações">Pedir uma declaração</NextLink>
         </div>
         <section className="panel">
            <SectionHead title="Documentos de matrícula" />
            <div className="document-summary">
               <div>
                  <strong>
                     {sent}
                     <span> de 6 enviados</span>
                  </strong>
                  <p>Um passo de cada vez para deixar tudo em dia.</p>
               </div>
               <div className="document-counts">
                  <span>
                     <b>{validated}</b> validados
                  </span>
                  <span>
                     <b>{sent - validated}</b> em conferência
                  </span>
                  <span>
                     <b>{6 - sent}</b> para enviar
                  </span>
               </div>
            </div>
            <progress value={sent} max={6} aria-label={`${sent} de 6 documentos enviados`} />
            <div className="documents-list">
               {documentTypes.map(d => {
                  const status = state.docs[d.id]?.status;
                  return (
                     <button
                        key={d.id}
                        className="document-row"
                        onClick={() => {
                           setSelected(d.id);
                           setFile(null);
                           setError("");
                        }}
                     >
                        <span className={`document-symbol ${status === "Validado" ? "success" : ""}`}>
                           {status === "Validado" ? <CheckCircle2 size={23} /> : <FileText size={23} />}
                        </span>
                        <span className="document-row-copy">
                           <strong>{d.name}</strong>
                           <small>{status ? state.docs[d.id].name : d.description}</small>
                        </span>
                        <Pill tone={status === "Validado" ? "green" : status === "Em conferência" ? "blue" : "amber"}>
                           {status || "Para enviar"}
                        </Pill>
                        <span className="document-row-action">
                           {status ? "Ver detalhes" : "Enviar"}
                           <ArrowRight size={16} />
                        </span>
                     </button>
                  );
               })}
            </div>
         </section>
         <Callout title="Teste com arquivos de exemplo">
            Nenhum arquivo é enviado para a faculdade. O protótipo guarda somente o nome do arquivo e o status nesta máquina. Use arquivos
            sem dados pessoais.
         </Callout>
         <Related
            items={[
               { to: "/secretaria/atendimento", title: "Não tenho um dos documentos: pedir orientação" },
               { to: "/meus-dados", title: "Conferir meus dados cadastrais" },
            ]}
         />
         <Modal
            open={!!selected}
            onClose={() => setSelected(null)}
            title={active?.name || "Documento"}
            description={active?.description || "Selecione um documento."}
         >
            {active && (
               <>
                  <Pill tone={state.docs[active.id] ? "blue" : "amber"}>{state.docs[active.id]?.status || "Para enviar"}</Pill>
                  {state.docs[active.id] && <p>Arquivo de teste: {state.docs[active.id].name}. O conteúdo não foi armazenado.</p>}
                  <div className="upload-zone">
                     <Upload size={29} />
                     <strong>Escolha um arquivo de teste</strong>
                     <p>PDF, JPG ou PNG · até 10 MB</p>
                     <input
                        aria-label="Escolher documento de teste"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={selectFile}
                        aria-invalid={!!error}
                        aria-describedby={error ? "file-error" : undefined}
                     />
                  </div>
                  <label className="button secondary full camera-button">
                     <Camera size={18} />
                     Fotografar um documento de teste
                     <input className="sr-only" type="file" accept="image/*" capture="environment" onChange={selectFile} />
                  </label>
                  {error && (
                     <p id="file-error" className="field-error" role="alert">
                        {error}
                     </p>
                  )}
                  {file && (
                     <p className="file-name">
                        <FileText size={16} />
                        {file.name} · {(file.size / 1024).toFixed(0)} KB
                     </p>
                  )}
                  <button className="button primary full" disabled={!file || saving} onClick={save}>
                     {saving ? "Registrando…" : "Simular envio do documento"}
                  </button>
                  {state.docs[active.id] && (
                     <details className="demo-tools">
                        <summary>Testar resposta da conferência</summary>
                        <div className="actions">
                           <button
                              className="button secondary"
                              onClick={() => {
                                 update(s => ({ ...s, docs: { ...s.docs, [active.id]: { ...s.docs[active.id], status: "Validado" } } }));
                                 setSelected(null);
                              }}
                           >
                              Simular validação
                           </button>
                           <button
                              className="button secondary"
                              onClick={() => {
                                 update(s => ({ ...s, docs: { ...s.docs, [active.id]: { ...s.docs[active.id], status: "Reenviar" } } }));
                                 setSelected(null);
                              }}
                           >
                              Simular pedido de reenvio
                           </button>
                        </div>
                     </details>
                  )}
               </>
            )}
         </Modal>
      </>
   );
}

function StudentCard() {
   const { state } = useDemo();
   return (
      <>
         <div className="student-card">
            <div className="row-between">
               <div className="card-brand">
                  <img src="/brand/anchieta.png" alt="Anchieta" />
                  <span>ALUNO ONLINE</span>
               </div>
               <GraduationCap size={29} />
            </div>
            <div className="card-student">
               <span className="card-photo">
                  <UserRound size={52} />
               </span>
               <div>
                  <h2>{state.profile.name}</h2>
                  <p>Ciências Contábeis</p>
                  <p>RA de demonstração: 20260001</p>
               </div>
            </div>
            <div className="card-bottom">
               <span>EXEMPLO · SEM VALIDADE</span>
               <span>2º período · 2026/2</span>
            </div>
         </div>
         <Callout title="Identificação ilustrativa">
            Esta carteirinha não comprova matrícula e não possui código de validação. A implementação real deve usar o documento e a
            validade oficiais.
         </Callout>
         <div className="actions">
            <button className="button primary" onClick={() => downloadDocument("Carteirinha de demonstração")}>
               Baixar versão de exemplo
            </button>
            <NextLink to="/meus-dados">Ver meus dados</NextLink>
         </div>
         <Related
            items={[
               { to: "/secretaria/servicos/CSA_150", title: "Preciso comprovar que estudo no Anchieta" },
               { to: "/secretaria/servicos/CSA_054", title: "Consultar cadastro de transporte estudantil" },
            ]}
         />
      </>
   );
}

function Certificates() {
   const [q, setQ] = useState("");
   const items = ["Encontro de Gestão e Negócios", "The English Lab", "Tecnologia e sociedade"].filter(s =>
      s.toLowerCase().includes(q.toLowerCase()),
   );
   return (
      <>
         <Callout title="Certificados de exemplo">
            Os arquivos desta tela são demonstrativos. Para comprovação oficial, utilize os documentos emitidos pela instituição.
         </Callout>
         <label className="search-label">
            Encontrar um certificado
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Busque pelo nome da atividade" />
         </label>
         <div className="certificate-grid">
            {items.map((title, i) => (
               <section className="certificate" key={title}>
                  <div className="certificate-art">
                     <Award size={49} />
                     <span>ANCHIETA</span>
                  </div>
                  <div>
                     <Pill tone="green">Concluído · exemplo</Pill>
                     <h2>{title}</h2>
                     <p>{i === 0 ? "10" : "5"} horas · atividade ilustrativa</p>
                     <div className="actions">
                        <DocButton title={"Certificado — " + title} />
                        <button
                           className="button ghost"
                           onClick={async () => {
                              try {
                                 await navigator.clipboard.writeText(
                                    "Atividade ilustrativa: " + title + " — protótipo Aluno Online CX. Sem validade.",
                                 );
                                 toast.success("Descrição de exemplo copiada");
                              } catch {
                                 toast.error("Não foi possível copiar. Você pode baixar o exemplo.");
                              }
                           }}
                        >
                           Copiar descrição
                        </button>
                     </div>
                  </div>
               </section>
            ))}
         </div>
         {!items.length && <p role="status">Nenhum certificado encontrado. Tente outro nome.</p>}
         <Related
            items={[
               { to: "/academico/horas", title: "Conferir horas complementares validadas" },
               { to: "/academico/extensao", title: "Conhecer novas atividades de extensão" },
            ]}
         />
      </>
   );
}

function Preferences() {
   const { state, update, reset } = useDemo();
   const [confirm, setConfirm] = useState(false);
   return (
      <>
         <section className="panel preferences">
            <SectionHead title="Do seu jeito" />
            {[
               {
                  title: "Tema escuro",
                  text: "Uma opção para ambientes com menos luz.",
                  checked: state.theme === "dark",
                  action: (checked: boolean) => update(s => ({ ...s, theme: checked ? "dark" : "light" })),
               },
               {
                  title: "Texto maior",
                  text: "Mais conforto para ler informações e orientações.",
                  checked: state.largeText,
                  action: (checked: boolean) => update(s => ({ ...s, largeText: checked })),
               },
               {
                  title: "Reduzir movimento",
                  text: "Use transições mais simples e diretas.",
                  checked: state.reducedMotion,
                  action: (checked: boolean) => update(s => ({ ...s, reducedMotion: checked })),
               },
               {
                  title: "Avisos de demonstração",
                  text: "Preferência local; não envia e-mails ou notificações.",
                  checked: state.notifications,
                  action: (checked: boolean) => update(s => ({ ...s, notifications: checked })),
               },
            ].map(i => (
               <label className="preference-row" key={i.title}>
                  <span>
                     <strong>{i.title}</strong>
                     <small>{i.text}</small>
                  </span>
                  <input type="checkbox" role="switch" checked={i.checked} onChange={e => i.action(e.target.checked)} />
               </label>
            ))}
         </section>
         <section className="panel">
            <SectionHead title="Explorar diferentes situações" />
            <label className="form-stack">
               Cenário da demonstração
               <select value={state.scenario} onChange={e => update(s => ({ ...s, scenario: e.target.value as typeof s.scenario }))}>
                  <option value="base">Base — semestre em curso</option>
                  <option value="dp">Exemplo — disciplina em dependência</option>
                  <option value="financeiro">Exemplo — cobrança pendente</option>
                  <option value="vazio">Exemplo — sem solicitações</option>
               </select>
            </label>
            <p className="muted">Os cenários são fictícios e permitem avaliar situações que a conta real não apresenta.</p>
            <button className="button secondary" onClick={() => setConfirm(true)}>
               Recomeçar demonstração
            </button>
         </section>
         <Modal
            open={confirm}
            onClose={() => setConfirm(false)}
            title="Recomeçar a demonstração?"
            description="Os pedidos, os nomes de arquivos e as preferências locais voltarão ao exemplo inicial."
         >
            <div className="actions">
               <button className="button secondary" onClick={() => setConfirm(false)}>
                  Manter meu exemplo
               </button>
               <button
                  className="button primary"
                  onClick={() => {
                     reset();
                     setConfirm(false);
                     toast.success("Demonstração reiniciada");
                  }}
               >
                  Recomeçar
               </button>
            </div>
         </Modal>
      </>
   );
}
