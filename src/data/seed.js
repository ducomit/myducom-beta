export const seed = {
  supportEmail: "support@platform.local",
  tenants: [
    { id: "tnt_001", name: "Muster GmbH" },
    { id: "tnt_002", name: "Alpha Bau AG" },
    { id: "tnt_003", name: "Nordwind KG" }
  ],
  users: [
    { id: "usr_admin", role: "ADMIN", email: "admin@platform.local", tenantId: null },
    { id: "usr_staff_01", role: "STAFF", email: "staff1@platform.local", tenantId: null },
    { id: "usr_staff_02", role: "STAFF", email: "staff2@platform.local", tenantId: null },
    { id: "usr_cust_001_a", role: "CUSTOMER", email: "it@muster-gmbh.local", tenantId: "tnt_001" },
    { id: "usr_cust_002_a", role: "CUSTOMER", email: "it@alpha-bau.local", tenantId: "tnt_002" },
    { id: "usr_cust_003_a", role: "CUSTOMER", email: "it@nordwind.local", tenantId: "tnt_003" }
  ],
  staffTenants: [
    { userId: "usr_staff_01", tenantId: "tnt_001" },
    { userId: "usr_staff_01", tenantId: "tnt_002" },
    { userId: "usr_staff_02", tenantId: "tnt_003" }
  ],
  employees: [
    { id: "emp_001", tenantId: "tnt_001", firstName: "Lena", lastName: "Koch", email: "lena.koch@muster.local", personalNumber: "M-1001", costCenter: "IT", companyRole: "IT Admin" },
    { id: "emp_002", tenantId: "tnt_001", firstName: "Tim", lastName: "Weber", email: "tim.weber@muster.local", personalNumber: "M-1002", costCenter: "Sales", companyRole: "Sales" },
    { id: "emp_009", tenantId: "tnt_002", firstName: "Anna", lastName: "Schulz", email: "anna.schulz@alpha.local", personalNumber: "A-2001", costCenter: "IT", companyRole: "IT Lead" },
    { id: "emp_010", tenantId: "tnt_002", firstName: "Ben", lastName: "Krüger", email: "ben.krueger@alpha.local", personalNumber: "A-2002", costCenter: "Site", companyRole: "Bauleitung" },
    { id: "emp_015", tenantId: "tnt_003", firstName: "Greta", lastName: "Peters", email: "greta.peters@nordwind.local", personalNumber: "N-3001", costCenter: "IT", companyRole: "IT Admin" }
  ],
  simCards: [
    { id: "sim_001", tenantId: "tnt_001", simNumber: "894901000000001", phoneNumber: "+491511000001" },
    { id: "sim_002", tenantId: "tnt_001", simNumber: "894901000000002", phoneNumber: "+491511000002" },
    { id: "sim_007", tenantId: "tnt_002", simNumber: "894902000000007", phoneNumber: "+491522000007" },
    { id: "sim_013", tenantId: "tnt_003", simNumber: "894903000000013", phoneNumber: "+491533000013" }
  ],
  devices: [
    { id: "dev_001", tenantId: "tnt_001", manufacturer: "Apple", model: "iPhone 14", costMonthly: 39.99, saleDate: "2024-06-15", imei: "356111111111111", simCapable: true, category: "Smartphone", isRental: true, employeeId: "emp_001", simCardId: "sim_001" },
    { id: "dev_002", tenantId: "tnt_001", manufacturer: "Samsung", model: "Galaxy S23", costMonthly: 0, saleDate: "2023-10-02", imei: "356222222222222", simCapable: true, category: "Smartphone", isRental: false, employeeId: "emp_002", simCardId: "sim_002" },
    { id: "dev_007", tenantId: "tnt_002", manufacturer: "Apple", model: "iPhone 15", costMonthly: 44.9, saleDate: "2024-12-01", imei: "357111111111111", simCapable: true, category: "Smartphone", isRental: true, employeeId: "emp_009", simCardId: "sim_007" },
    { id: "dev_013", tenantId: "tnt_003", manufacturer: "Apple", model: "iPhone 14 Pro", costMonthly: 0, saleDate: "2023-09-19", imei: "358111111111111", simCapable: true, category: "Smartphone", isRental: false, employeeId: "emp_015", simCardId: "sim_013" }
  ],
  contracts: [
    { id: "ctr_001", tenantId: "tnt_001", provider: "Vodafone", status: "AKTIV", type: "Mobilfunk", plan: "Business Red M", expectedCost: 29.99, activationDate: "2024-07-01", employeeId: "emp_001", deviceId: "dev_001", simCardId: "sim_001" },
    { id: "ctr_002", tenantId: "tnt_001", provider: "Telekom", status: "VERLÄNGERBAR", type: "Mobilfunk", plan: "Business Mobil L", expectedCost: 34.95, activationDate: "2023-10-05", employeeId: "emp_002", deviceId: "dev_002", simCardId: "sim_002" },
    { id: "ctr_007", tenantId: "tnt_002", provider: "Vodafone", status: "AKTIV", type: "Mobilfunk", plan: "Business Red L", expectedCost: 39.99, activationDate: "2024-12-05", employeeId: "emp_009", deviceId: "dev_007", simCardId: "sim_007" },
    { id: "ctr_013", tenantId: "tnt_003", provider: "Vodafone", status: "GEKÜNDIGT", type: "Mobilfunk", plan: "Business Red M", expectedCost: 29.99, activationDate: "2023-09-20", employeeId: "emp_015", deviceId: "dev_013", simCardId: "sim_013" }
  ],
  tickets: [
    { id: "tck_001", tenantId: "tnt_001", createdById: "usr_cust_001_a", assignedToId: "usr_staff_01", subject: "SIM-Karte funktioniert nicht", description: "SIM sim_003 hat kein Netz seit heute.", category: "SIM", priority: "HIGH", status: "OPEN" },
    { id: "tck_005", tenantId: "tnt_002", createdById: "usr_cust_002_a", assignedToId: "usr_staff_01", subject: "Neues Gerät zu Mitarbeiter zuordnen", description: "Bitte dev_012 dem Mitarbeiter emp_012 zuordnen.", category: "Device", priority: "MEDIUM", status: "IN_PROGRESS" },
    { id: "tck_008", tenantId: "tnt_003", createdById: "usr_cust_003_a", assignedToId: "usr_staff_02", subject: "SIM zu iPad zuordnen", description: "Bitte sim_018 dem Gerät dev_018 zuordnen.", category: "SIM", priority: "LOW", status: "WAITING_CUSTOMER" }
  ],
  ticketComments: [
    { id: "tcm_001", ticketId: "tck_001", authorId: "usr_staff_01", body: "Bitte Gerät neu starten und APN prüfen." },
    { id: "tcm_005", ticketId: "tck_005", authorId: "usr_staff_01", body: "Zuordnung ist in Arbeit." },
    { id: "tcm_006", ticketId: "tck_008", authorId: "usr_staff_02", body: "Bitte bestätigen, ob Austausch oder zusätzliche SIM." }
  ]
};
