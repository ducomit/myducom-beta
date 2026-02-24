import { useMemo, useState } from "react";
import { seed } from "./data/seed";

const tabs = ["dashboard", "mitarbeiter", "vertraege", "tickets", "admin"];

function allowedTenants(user) {
  if (!user) return [];
  if (user.role === "ADMIN") return seed.tenants.map((t) => t.id);
  if (user.role === "CUSTOMER") return [user.tenantId];
  return seed.staffTenants.filter((st) => st.userId === user.id).map((st) => st.tenantId);
}

export default function App() {
  const [userId, setUserId] = useState(seed.users[0].id);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [query, setQuery] = useState("");
  const user = seed.users.find((u) => u.id === userId);
  const tenantsAllowed = allowedTenants(user);
  const scoped = useMemo(() => {
    const pick = (arr) => arr.filter((x) => tenantsAllowed.includes(x.tenantId));
    return { employees: pick(seed.employees), devices: pick(seed.devices), simCards: pick(seed.simCards), contracts: pick(seed.contracts), tickets: pick(seed.tickets) };
  }, [tenantsAllowed]);
  const metrics = useMemo(() => {
    const contracts = scoped.contracts.reduce((a, c) => a + c.expectedCost, 0);
    const rental = scoped.devices.filter((d) => d.isRental).reduce((a, d) => a + d.costMonthly, 0);
    const owned = scoped.devices.filter((d) => !d.isRental).reduce((a, d) => a + d.costMonthly, 0);
    return { contracts, rental, owned, total: contracts + rental + owned };
  }, [scoped]);

  const search = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      Mitarbeiter: scoped.employees.filter((e) => [e.firstName, e.lastName, e.email, e.personalNumber, e.costCenter].join(" ").toLowerCase().includes(q)),
      Geräte: scoped.devices.filter((d) => [d.imei, d.model, d.manufacturer].join(" ").toLowerCase().includes(q)),
      SIM: scoped.simCards.filter((s) => [s.simNumber, s.phoneNumber].join(" ").toLowerCase().includes(q)),
      Verträge: scoped.contracts.filter((c) => [c.provider, c.plan].join(" ").toLowerCase().includes(q))
    };
  }, [query, scoped]);

  return <div className="app">
    <header className="header card">
      <div>
        <h1>Myducom MVP</h1>
        <p>Minimalistisches Multi-Tenant Vertragsmanagement</p>
      </div>
      <div className="controls">
        <select value={userId} onChange={(e)=>setUserId(e.target.value)}>
          {seed.users.map((u)=><option value={u.id} key={u.id}>{u.email} · {u.role}</option>)}
        </select>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Globale Suche..."/>
      </div>
    </header>

    <div className="chips"><span className="chip">{user.role}</span><span className="chip">{tenantsAllowed.join(", ")}</span></div>

    {search && <section className="card search-grid">{Object.entries(search).map(([k,v])=><div key={k}><h4>{k} ({v.length})</h4>{v.map((x)=><span className="chip" key={x.id}>{x.id}</span>)}</div>)}</section>}

    <nav className="tabs">{tabs.filter((t)=>user.role==="ADMIN" || t!=="admin").map((t)=><button key={t} className={activeTab===t?"active":""} onClick={()=>setActiveTab(t)}>{t}</button>)}</nav>

    {activeTab==="dashboard" && <section className="metrics">{Object.entries(metrics).map(([k,v])=><article className="card" key={k}><p>{k}</p><h2>{v.toFixed(2)} €</h2></article>)}</section>}

    {activeTab==="mitarbeiter" && <DataTable headers={["Vorname","Nachname","E-Mail","Personalnummer","Kostenstelle"]} rows={scoped.employees.map(e=>[e.firstName,e.lastName,e.email,e.personalNumber,e.costCenter])}/>}    
    {activeTab==="vertraege" && <DataTable headers={["Vorname","Nachname","E-Mail","Kostenstelle","Personalnummer","Rolle","Verträge","SIMs","Geräte"]} rows={scoped.employees.map(e=>[e.firstName,e.lastName,e.email,e.costCenter,e.personalNumber,e.companyRole,scoped.contracts.filter(c=>c.employeeId===e.id).length,scoped.simCards.filter(s=>scoped.devices.some(d=>d.employeeId===e.id&&d.simCardId===s.id)).length,scoped.devices.filter(d=>d.employeeId===e.id).length])}/>}    
    {activeTab==="tickets" && <section className="tickets"><div className="card"><h3>Ticket erstellen</h3><input placeholder="Betreff (Pflicht)"/><textarea placeholder="Beschreibung (Pflicht)"/><div className="row"><input placeholder="Kategorie"/><input placeholder="Priorität"/></div><button>An Support senden ({seed.supportEmail})</button></div><DataTable headers={["Betreff","Status","Priorität","Tenant","Zuweisung"]} rows={scoped.tickets.map(t=>[t.subject,t.status,t.priority,t.tenantId,t.assignedToId||seed.supportEmail])}/></section>}
    {activeTab==="admin" && <section className="card"><h3>Admin</h3><p>Marken, Benutzer/Rollen, Staff-Tenant-Mapping.</p></section>}
  </div>;
}

function DataTable({ headers, rows }) {
  return <div className="card table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;
}
