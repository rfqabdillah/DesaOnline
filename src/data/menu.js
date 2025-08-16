export var menuItems = {
  "data": [
    {
      "headTitle1": "General",
      "type": "headtitle"
    },
    {
      "title": "Beranda",
      "icon": "stroke-home",
      "iconf": "fill-home",
      "type": "link",
      "path": "/",
      "active": false
    },
    {
      "title": "Informasi Desa",
      "icon": "stroke-faq",
      "iconf":"fill-faq",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/village-information/profile",
          "title": "Profil Desa",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Pemerintahan",
      "icon": "stroke-board",
      "iconf":"fill-board",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/village-government/officials",
          "title": "Perangkat Desa",
          "type": "link",
          "active":false
        },
        {
          "path": "/village-government/tenure-periods",
          "title": "Periode Jabatan",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Kependudukan",
      "icon": "customers",
      "iconf":"customers",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/population/residents",
          "title": "Penduduk",
          "type": "link",
          "active":false
        },
        {
          "path": "/population/families",
          "title": "keluarga",
          "type": "link",
          "active":false
        },
        {
          "path": "/population/households",
          "title": "Rumah Tangga",
          "type": "link",
          "active":false
        },
        {
          "path": "/population/groups",
          "title": "Kelompok",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Dokumen",
      "icon": "stroke-file",
      "iconf":"fill-file",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/documents/incoming-letters",
          "title": "Surat Masuk",
          "type": "link",
          "active":false
        },
        {
          "path": "/documents/outgoing-letters",
          "title": "Surat Keluar",
          "type": "link",
          "active":false
        },
        {
          "path": "/documents/regulations",
          "title": "Peraturan/regulasi",
          "type": "link",
          "active":false
        },
        {
          "path": "/documents/decrees",
          "title": "Keputusan Kepala Desa",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Agenda Kegiatan",
      "icon": "stroke-calendar",
      "iconf":"fill-calendar",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/activities/programs",
          "title": "Progam Kegiatan",
          "type": "link",
          "active":false
        },
        {
          "path": "/activities/categories",
          "title": "Kategori Kegiatan",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Keuangan",
      "icon": "stroke-charts",
      "iconf":"fill-charts",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/cash-flow/income",
          "title": "Pemasukan",
          "type": "link",
          "active":false
        },
        {
          "path": "/cash-flow/expenses",
          "title": "Pengeluaran",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Aset/Inventory",
      "icon": "stroke-bonus-kit",
      "iconf":"fill-bonus-kit",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/assets/land",
          "title": "Tanah",
          "type": "link",
          "active":false
        },
        {
          "path": "/assets/buildings",
          "title": "Bangunan",
          "type": "link",
          "active":false
        },
        {
          "path": "/assets/rooms",
          "title": "Ruangan",
          "type": "link",
          "active":false
        },
        {
          "path": "/assets/vehicles",
          "title": "Kendaraan",
          "type": "link",
          "active":false
        },
        {
          "path": "/assets/equipment",
          "title": "Peralatan dan Mesin",
          "type": "link",
          "active":false
        },
        {
          "path": "/assets/items",
          "title": "Barang",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Pertanahan",
      "icon": "stroke-maps",
      "iconf":"fill-maps",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/land-affairs/parcels",
          "title": "Data Percil",
          "type": "link",
          "active":false
        },
        {
          "path": "/land-affairs/c-ledger",
          "title": "C Desa",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Badan Usaha",
      "icon": "stroke-ecommerce",
      "iconf":"fill-ecommerce",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/enterprise/profile",
          "title": "Profil",
          "type": "link",
          "active":false
        },
        {
          "path": "/enterprise/management",
          "title": "Pengurus/Pengelola",
          "type": "link",
          "active":false
        },
        {
          "path": "/enterprise/reports",
          "title": "Laporan Usaha",
          "type": "link",
          "active":false
        },
      ]
    },
    {
    "title": "Website",
    "icon": "stroke-internationalization",
    "iconf": "fill-internationalization",
    "type": "sub",
    "active": false,
    "children": [
      {
        "title": "Artikel",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/website/articles/list",
            "title": "Artikel",
            "type": "link",
            "active": false
          },
          {
            "path": "/website/articles/categories",
            "title": "Kategori Artikel",
            "type": "link",
            "active": false
          }
        ]
      },
      {
        "title": "Download",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/website/download/documents",
            "title": "Dokumen",
            "type": "link",
            "active": false
          },
          {
            "path": "/website/download/document-types",
            "title": "Jenis Dokumen",
            "type": "link",
            "active": false
          }
        ]
      }
    ]
    },
    {
      "title": "Banner",
      "icon": "stroke-gallery",
      "iconf": "fill-gallery",
      "type": "link",
      "path": "/banner",
      "active": false
    },
    {
      "title": "Layanan",
      "icon": "stroke-job-search",
      "iconf": "fill-job-search",
      "type": "link",
      "path": "/services",
      "active": false
    },
    {
      "title": "Pengumuman",
      "icon": "notification",
      "iconf": "notification",
      "type": "link",
      "path": "/notices",
      "active": false
    },
    {
      "title": "Link Terkait",
      "icon": "stroke-button",
      "iconf": "fill-button",
      "type": "link",
      "path": "/related-links",
      "active": false
    },

    {
      "headTitle1": "Referensi",
      "type": "headtitle"
    },
    {
      "title": "Umum",
      "icon": "stroke-user",
      "iconf":"fill-user",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/general/user",
          "title": "Pengguna",
          "type": "link",
          "active":false
        },
        {
          "path": "/general/roles",
          "title": "Role",
          "type": "link",
          "active":false
        },
        {
          "path": "/general/regions",
          "title": "Wilayah",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Kependudukan",
      "icon": "stroke-social",
      "iconf":"fill-social",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/demographics/religions",
          "title": "Agama",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/blood-types",
          "title": "Golongan Darah",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/family-relationships",
          "title": "Hubungan Keluarga",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/genders",
          "title": "Jenis Kelamin",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/occupations",
          "title": "Pekerjaan",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/education-levels",
          "title": "Pendidikan",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/birth-attendants",
          "title": "Penolong Kelahiran",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/birth-places",
          "title": "Tempat Dilahirkan",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/martial-statuses",
          "title": "Status Perkawinan",
          "type": "link",
          "active":false
        },
        {
          "path": "/demographics/group-categories",
          "title": "Kategori Kelompok",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Keuangan",
      "icon": "stroke-charts",
      "iconf":"fill-charts",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/finance/budget-sources",
          "title": "Sumber Anggaran",
          "type": "link",
          "active":false
        },
        {
          "path": "/finance/account-codes",
          "title": "Kode Rekening",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Pemerintahan",
      "icon": "stroke-builders",
      "iconf":"fill-builders",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/government/positions",
          "title": "Jabatan",
          "type": "link",
          "active":false
        },
        {
          "path": "/government/official-status",
          "title": "Status Perangkat",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "BUMDES",
      "icon": "stroke-project",
      "iconf":"fill-project",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/bumdes/business-fields",
          "title": "Bidang Usaha",
          "type": "link",
          "active":false
        },
        {
          "path": "/bumdes/report-periods",
          "title": "Periode Laporan Usaha",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Dokumen",
      "icon": "stroke-file",
      "iconf":"fill-file",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/archives/incoming-letter-types",
          "title": "Jenis Surat Masuk",
          "type": "link",
          "active":false
        },
        {
          "path": "/archives/outgoing-letter-types",
          "title": "Jenis Surat Keluar",
          "type": "link",
          "active":false
        },
        {
          "path": "/archives/regulation-types",
          "title": "Jenis Peraturan/Regulasi",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Aset",
      "icon": "stroke-bonus-kit",
      "iconf": "fill-bonus-kit",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/inventory/legal-status",
          "title": "Status Hak",
          "type": "link",
          "active": false
        },
        {
          "path": "/inventory/land-origins",
          "title": "Asal Usul Tanah",
          "type": "link",
          "active": false
        },
        {
          "path": "/inventory/acquisition-procedures",
          "title": "Prosedur Penguasaan",
          "type": "link",
          "active": false
        },
        {
          "path": "/inventory/acquisitions",
          "title": "Perolehan",
          "type": "link",
          "active": false
        },
        {
          "path": "/inventory/conditions",
          "title": "Kondisi",
          "type": "link",
          "active": false
        },
        {
          "path": "/inventory/multi-story-construction",
          "title": "Kontruksi Bertingkat",
          "type": "link",
          "active": false
        },
        {
          "path": "/inventory/concrete-construction",
          "title": "Kontruksi Beton",
          "type": "link",
          "active": false
        },
        {
          "path": "/inventory/physical-status",
          "title": "Keberadaan Fisik",
          "type": "link",
          "active": false
        },
        {
          "path": "/inventory/item-categories",
          "title": "Kategori Barang",
          "type": "link",
          "active": false
        }
      ]
    },



  ]
}
