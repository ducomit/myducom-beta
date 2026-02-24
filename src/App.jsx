import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Textarea
} from "@heroui/react";
import { seed } from "./data/seed";
import { ShadButton } from "./components/ui/button";
import { ShadCard, ShadCardContent, ShadCardHeader } from "./components/ui/card";
import { ShadInput } from "./components/ui/input";

const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const TICKET_FLOW = ["OPEN", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "CLOSED"];
const euro = (v) => `${v.toFixed(2)} €`;
const byTenant = (arr, allowed) => arr.filter((x) => allowed.includes(x.tenantId));

function allowedTenants(user) {
  if (!user) return [];
  if (user.role === "ADMIN") return seed.tenants.map((t) => t.id);
  if (user.role === "CUSTOMER") return [user.tenantId];
  return seed.staffTenants.filter((m) => m.userId === user.id).map((m) => m.tenantId);
}

export default function App() {
  const [userId, setUserId] = useState(seed.users[0].id);
  const [tab, setTab] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(seed.employees[0]?.id);
  const [selectedYear, setSelectedYear] = useState("2026");
  const user = seed.users.find((u) => u.id === userId);
  const visibleTenants = useMemo(() => allowedTenants(user), [user]);

  const scoped = useMemo(() => {
    const employees = byTenant(seed.employees, visibleTenants);
    const devices = byTenant(seed.devices, visibleTenants);
    const simCards = byTenant(seed.simCards, visibleTenants);
    const contracts = byTenant(seed.contracts, visibleTenants);
    const tickets = byTenant(seed.tickets, visibleTenants);
    return { employees, devices, simCards, contracts, tickets };
  }, [visibleTenants]);

  const dashboard = useMemo(() => {
    const contractCost = scoped.contracts.reduce((sum, c) => sum + c.expectedCost, 0);
    const rentalCost = scoped.devices.filter((d) => d.isRental).reduce((sum, d) => sum + d.costMonthly, 0);
    const ownedCost = scoped.devices.filter((d) => !d.isRental).reduce((sum, d) => sum + d.costMonthly, 0);
    const monthly = Array.from({ length: 12 }).map((_, i) => {
      const mm = `${i + 1}`.padStart(2, "0");
      const contracts = scoped.contracts.filter((c) => c.activationDate?.startsWith(`${selectedYear}-${mm}`)).reduce((sum, c) => sum + c.expectedCost, 0);
      const rental = scoped.devices.filter((d) => d.saleDate?.startsWith(`${selectedYear}-${mm}`) && d.isRental).reduce((sum, d) => sum + d.costMonthly, 0);
      const owned = scoped.devices.filter((d) => d.saleDate?.startsWith(`${selectedYear}-${mm}`) && !d.isRental).reduce((sum, d) => sum + d.costMonthly, 0);
      return { label: MONTHS[i], contracts, rental, owned, total: contracts + rental + owned };
    });
    const status = ["AKTIV", "VERLÄNGERBAR", "GEKÜNDIGT"].map((s) => ({ name: s, count: scoped.contracts.filter((c) => c.status === s).length }));
    const byBrand = scoped.devices.reduce((acc, d) => ({ ...acc, [d.manufacturer ?? "Unbekannt"]: (acc[d.manufacturer ?? "Unbekannt"] ?? 0) + 1 }), {});
    return { contractCost, rentalCost, ownedCost, total: contractCost + rentalCost + ownedCost, monthly, status, totalDevices: scoped.devices.length, totalRental: scoped.devices.filter((d) => d.isRental).length, byBrand };
  }, [scoped, selectedYear]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      Mitarbeiter: scoped.employees.filter((e) => [e.firstName, e.lastName, e.email, e.personalNumber, e.costCenter].join(" ").toLowerCase().includes(q)),
      Geräte: scoped.devices.filter((d) => [d.imei, d.model, d.manufacturer].join(" ").toLowerCase().includes(q)),
      SIM: scoped.simCards.filter((s) => [s.simNumber, s.phoneNumber].join(" ").toLowerCase().includes(q)),
      Verträge: scoped.contracts.filter((c) => [c.provider, c.plan].join(" ").toLowerCase().includes(q))
    };
  }, [query, scoped]);

  const selectedEmployee = scoped.employees.find((e) => e.id === selectedEmployeeId) ?? scoped.employees[0];
  const employeeContracts = scoped.contracts.filter((c) => c.employeeId === selectedEmployee?.id);
  const employeeDevices = scoped.devices.filter((d) => d.employeeId === selectedEmployee?.id);

  return (
    <main className="layout">
      <ShadCard>
        <ShadCardHeader className="hero-header">
          <div>
            <h1>Plattform für Vertragsverwaltung & IT-Management</h1>
            <p className="sub">HeroUI + shadcn/ui Stil · Mandantenfähig · RBAC · Kostenkontrolle</p>
          </div>
          <div className="quick-actions">
            <ShadButton variant="outline">+ Mitarbeiter</ShadButton>
            <ShadButton>+ Ticket</ShadButton>
          </div>
        </ShadCardHeader>
        <ShadCardContent className="topbar-controls">
          <Select label="Login als" selectedKeys={[userId]} onChange={(e) => setUserId(e.target.value)}>
            {seed.users.map((u) => <SelectItem key={u.id} value={u.id}>{u.email} ({u.role})</SelectItem>)}
          </Select>
          <ShadInput placeholder="Globale Suche: Name, IMEI, SIM, Tarif..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </ShadCardContent>
      </ShadCard>

      <section className="chips">
        <Chip color="primary" variant="flat">Rolle: {user.role}</Chip>
        <Chip color="secondary" variant="flat">Tenants: {visibleTenants.join(", ")}</Chip>
      </section>

      {searchResults && (
        <Card>
          <CardHeader>Globale Suche – gruppierte Ergebnisse</CardHeader>
          <Divider />
          <CardBody className="search-grid">
            {Object.entries(searchResults).map(([group, entries]) => (
              <div key={group}><h4>{group} ({entries.length})</h4>{entries.slice(0, 5).map((entry) => <Chip key={entry.id} variant="bordered" className="mr-2 mb-2">{entry.id}</Chip>)}</div>
            ))}
          </CardBody>
        </Card>
      )}

      <Tabs selectedKey={tab} onSelectionChange={setTab}>
        <Tab key="dashboard" title="Dashboard">
          <section className="metric-grid">
            <Metric label="Verträge" value={dashboard.contractCost} color="primary" />
            <Metric label="Mietgeräte" value={dashboard.rentalCost} color="warning" />
            <Metric label="Geräte (owned)" value={dashboard.ownedCost} color="success" />
            <Metric label="Gesamt" value={dashboard.total} color="secondary" />
          </section>
          <section className="grid-two">
            <Card>
              <CardHeader className="flex-between">
                <span>Jahresverlauf (gestapelt)</span>
                <Select className="year" selectedKeys={[selectedYear]} onChange={(e) => setSelectedYear(e.target.value)}>
                  {["2023", "2024", "2025", "2026"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </Select>
              </CardHeader>
              <Divider />
              <CardBody>{dashboard.monthly.map((m) => { const max = Math.max(...dashboard.monthly.map((x) => x.total), 1); return <div key={m.label} className="bar-row"><span>{m.label}</span><div className="bar-track"><div className="bar contracts" style={{ width: `${(m.contracts / max) * 100}%` }} /><div className="bar rental" style={{ width: `${(m.rental / max) * 100}%` }} /><div className="bar owned" style={{ width: `${(m.owned / max) * 100}%` }} /></div><small>{euro(m.total)}</small></div>; })}</CardBody>
            </Card>
            <Card><CardHeader>Vertragsstatus</CardHeader><Divider /><CardBody>{dashboard.status.map((s) => <div key={s.name} className="pie-list"><span>{s.name}</span><Badge content={s.count} color="primary" /></div>)}</CardBody></Card>
          </section>
          <Card><CardHeader>Geräte & Mietgeräte Übersicht</CardHeader><Divider /><CardBody><p>Geräte gesamt: <strong>{dashboard.totalDevices}</strong> · Mietgeräte: <strong>{dashboard.totalRental}</strong></p><div className="chips">{Object.entries(dashboard.byBrand).map(([brand, count]) => <Chip key={brand} variant="flat">{brand}: {count}</Chip>)}</div></CardBody></Card>
        </Tab>

        <Tab key="mitarbeiter" title="Mitarbeiter">
          <Card><CardHeader className="flex-between"><span>Mitarbeiterliste</span><Select selectedKeys={[selectedEmployee?.id]} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-80">{scoped.employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}</Select></CardHeader><Divider /><CardBody><Table aria-label="Mitarbeiterliste"><TableHeader><TableColumn>Vorname</TableColumn><TableColumn>Nachname</TableColumn><TableColumn>E-Mail</TableColumn><TableColumn>Personalnummer</TableColumn><TableColumn>Kostenstelle</TableColumn></TableHeader><TableBody>{scoped.employees.map((e) => <TableRow key={e.id}><TableCell>{e.firstName}</TableCell><TableCell>{e.lastName}</TableCell><TableCell>{e.email}</TableCell><TableCell>{e.personalNumber}</TableCell><TableCell>{e.costCenter}</TableCell></TableRow>)}</TableBody></Table></CardBody></Card>
          <Card><CardHeader>Verträge (Mitarbeiter-Detail)</CardHeader><Divider /><CardBody><Table aria-label="Vertragsdetail"><TableHeader><TableColumn>Anbieter</TableColumn><TableColumn>Vertragsstatus</TableColumn><TableColumn>Vertragsart</TableColumn><TableColumn>Tarif</TableColumn><TableColumn>Erwartete Kosten</TableColumn><TableColumn>Aktivierungsdatum</TableColumn><TableColumn>Verknüpfung Gerät</TableColumn><TableColumn>Verknüpfung SIM-Karte</TableColumn></TableHeader><TableBody>{employeeContracts.map((c) => <TableRow key={c.id}><TableCell>{c.provider}</TableCell><TableCell>{c.status}</TableCell><TableCell>{c.type}</TableCell><TableCell>{c.plan}</TableCell><TableCell>{euro(c.expectedCost)}</TableCell><TableCell>{c.activationDate}</TableCell><TableCell>{c.deviceId ?? "-"}</TableCell><TableCell>{c.simCardId ?? "-"}</TableCell></TableRow>)}</TableBody></Table></CardBody></Card>
          <Card><CardHeader>Geräte (Mitarbeiter-Detail)</CardHeader><Divider /><CardBody><Table aria-label="Gerätedetail"><TableHeader><TableColumn>Hersteller</TableColumn><TableColumn>Modell</TableColumn><TableColumn>Kosten</TableColumn><TableColumn>Verkaufsdatum</TableColumn><TableColumn>IMEI</TableColumn><TableColumn>SIM fähig</TableColumn><TableColumn>Kategorie</TableColumn><TableColumn>Verknüpfung: SIM Nummer</TableColumn><TableColumn>Verknüpfung: Telefonnummer</TableColumn></TableHeader><TableBody>{employeeDevices.map((d) => { const sim = scoped.simCards.find((s) => s.id === d.simCardId); return <TableRow key={d.id}><TableCell>{d.manufacturer}</TableCell><TableCell>{d.model}</TableCell><TableCell>{euro(d.costMonthly || 0)}</TableCell><TableCell>{d.saleDate}</TableCell><TableCell>{d.imei ?? "-"}</TableCell><TableCell>{d.simCapable ? "Ja" : "Nein"}</TableCell><TableCell>{d.category}</TableCell><TableCell>{sim?.simNumber ?? "-"}</TableCell><TableCell>{sim?.phoneNumber ?? "-"}</TableCell></TableRow>; })}</TableBody></Table></CardBody></Card>
        </Tab>

        <Tab key="vertraege" title="Verträge">
          <Card><CardHeader>Zuordnungsübersicht</CardHeader><Divider /><CardBody><Table aria-label="Verträge Zuordnung"><TableHeader><TableColumn>Vorname</TableColumn><TableColumn>Nachname</TableColumn><TableColumn>E-Mail</TableColumn><TableColumn>Kostenstelle</TableColumn><TableColumn>Personalnummer</TableColumn><TableColumn>Rolle</TableColumn><TableColumn>Verträge</TableColumn><TableColumn>SIMs</TableColumn><TableColumn>Geräte</TableColumn></TableHeader><TableBody>{scoped.employees.map((e) => <TableRow key={e.id}><TableCell>{e.firstName}</TableCell><TableCell>{e.lastName}</TableCell><TableCell>{e.email}</TableCell><TableCell>{e.costCenter}</TableCell><TableCell>{e.personalNumber}</TableCell><TableCell>{e.companyRole}</TableCell><TableCell>{scoped.contracts.filter((x) => x.employeeId === e.id).length}</TableCell><TableCell>{scoped.simCards.filter((s) => scoped.devices.some((d) => d.employeeId === e.id && d.simCardId === s.id)).length}</TableCell><TableCell>{scoped.devices.filter((x) => x.employeeId === e.id).length}</TableCell></TableRow>)}</TableBody></Table></CardBody></Card>
        </Tab>

        <Tab key="tickets" title="Tickets">
          <section className="grid-two">
            <ShadCard>
              <ShadCardHeader>Ticket erstellen (shadcn/ui Form UX)</ShadCardHeader>
              <ShadCardContent>
                <ShadInput placeholder="Betreff (Pflicht)" />
                <textarea className="shad-textarea" placeholder="Beschreibung (Pflicht)" />
                <div className="two-cols"><ShadInput placeholder="Kategorie" /><ShadInput placeholder="Priorität" /></div>
                <div className="ticket-actions"><ShadButton>Ticket senden</ShadButton><span className="muted">E-Mail an assignedTo oder {seed.supportEmail}</span></div>
              </ShadCardContent>
            </ShadCard>
            <Card><CardHeader>Workflow & Verwaltung (HeroUI Tabelle)</CardHeader><Divider /><CardBody><div className="chips">{TICKET_FLOW.map((s) => <Chip key={s} variant="bordered">{s}</Chip>)}</div><Table aria-label="Ticketliste" className="mt-3"><TableHeader><TableColumn>Betreff</TableColumn><TableColumn>Status</TableColumn><TableColumn>Zuweisung</TableColumn><TableColumn>Tenant</TableColumn></TableHeader><TableBody>{scoped.tickets.map((t) => <TableRow key={t.id}><TableCell>{t.subject}</TableCell><TableCell>{t.status}</TableCell><TableCell>{t.assignedToId ?? seed.supportEmail}</TableCell><TableCell>{t.tenantId}</TableCell></TableRow>)}</TableBody></Table></CardBody></Card>
          </section>
        </Tab>

        {user.role === "ADMIN" && (
          <Tab key="admin" title="Admin">
            <Card><CardHeader>Stammdaten, Rollen & Staff-Zuweisungen</CardHeader><Divider /><CardBody><p>• Marken/Stammdaten pflegen</p><p>• User-/Rollenverwaltung</p><p>• StaffTenant-Mappings verwalten</p><p>• Audit-Logs einsehen</p><Button color="secondary" className="mt-3">Admin Aktion</Button></CardBody></Card>
          </Tab>
        )}
      </Tabs>
    </main>
  );
}

function Metric({ label, value, color }) {
  return <Card><CardBody><Chip color={color} variant="flat">{label}</Chip><h2 className="mt-3">{euro(value)}</h2></CardBody></Card>;
}
