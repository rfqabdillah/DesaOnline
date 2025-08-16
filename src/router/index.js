import {createRouter, createWebHashHistory} from "vue-router";
import Body from '../components/body';

import Default from '@/pages/dashboard/defaultPage.vue';
import Login from '@/auth/login.vue';

// Mulai General
import IndexProfile from "@/pages/villageInformation/profile/index.vue";

import IndexOfficials from "@/pages/villageGovernment/officials/index.vue";
import IndexTenurePeriods from "@/pages/villageGovernment/tenurePeriods/index.vue";

import IndexResident from "@/pages/population/residents/index.vue"
import IndexGroups from "@/pages/population/groups/index.vue"

import IndexPrograms from "@/pages/activities/programs/index.vue"
import IndexActivityCategories from "@/pages/activities/activityCategories/index.vue"

import IndexVehicles from "@/pages/assets/vehicles/index.vue"
import indexItems from "@/pages/assets/items/index.vue"

import IndexProfileEnterprise from "@/pages/enterprise/profile/index.vue";
import IndexManagement from '@/pages/enterprise/management/index.vue';
import IndexReports from '@/pages/enterprise/reports/index.vue';

import IndexCategoryArticles from "@/pages/website/categoryArticle/index.vue";
import IndexDocument from "@/pages/website/documents/index.vue"
import IndexDocumentTypes from "@/pages/website/documentTypes/index.vue";

import IndexBanner from "@/pages/banner/index.vue";
import IndexServices from "@/pages/services/index.vue";
import IndexNotices from "@/pages/notices/index.vue";
import IndexRelatedLinks from "@/pages/relatedLinks/index.vue";

// Mulai Referensi
import IndexUser from "@/pages/general/user/index.vue";
import IndexRoles from "@/pages/general/roles/index.vue";
import IndexRegion from "@/pages/general/regions/index.vue";

import IndexReligion from "@/pages/demographics/religions/index.vue";
import IndexBloodTypes from "@/pages/demographics/bloodtypes/index.vue";
import IndexFamilyRelationships from "@/pages/demographics/familyRelationships/index.vue";
import IndexGenders from "@/pages/demographics/genders/index.vue";
import IndexOccupations from "@/pages/demographics/occupations/index.vue";
import IndexEducationLevels from "@/pages/demographics/educationLevels/index.vue";
import IndexBirthAttendants from "@/pages/demographics/birthAttendants/index.vue";
import IndexBirthPlaces from "@/pages/demographics/birthPlaces/index.vue";
import IndexMartialStatuses from "@/pages/demographics/martialStatuses/index.vue";
import IndexGroupCategories from "@/pages/demographics/groupCategories/index.vue";

import IndexBudgetSources from "@/pages/finance/budgetSources/index.vue";

import IndexPositions from "@/pages/government/Positions/index.vue";
import IndexOfficialStatus from "@/pages/government/officialStatus/index.vue";

import IndexBusinessFields from "@/pages/bumdes/businessFields/index.vue";
import IndexReportPeriods from "@/pages/bumdes/reportPeriods/index.vue";

import IndexIncomingLetterTypes from "@/pages/documents/incomingLetterTypes/index.vue";
import IndexOutgoingLetterTypes from "@/pages/documents/outgoingLetterTypes/index.vue";
import IndexRegulationTypes from "@/pages/documents/regulationTypes/index.vue";

import IndexLegalStatus from "@/pages/inventory/legalStatus/index.vue";
import IndexLandOrigins from "@/pages/inventory/landOrigins/index.vue";
import IndexAcquisitionProcedures from "@/pages/inventory/acquisitionProcedures/index.vue";
import IndexAcquisitions from "@/pages/inventory/acquisitions/index.vue";
import IndexConditions from "@/pages/inventory/conditions/index.vue";
import IndexMultiStoryConstruction from "@/pages/inventory/multiStoryConstruction/index.vue";
import IndexConcreteConstruction from "@/pages/inventory/concreteConstruction/index.vue";
import IndexPhysicalStatus from "@/pages/inventory/physicalStatus/index.vue";
import IndexItemCategories from "@/pages/inventory/itemCategories/index.vue";


const routes =[
    {
        path: '/auth',
        children: [
          {
            path: '',
            name: 'Login',
            component: Login,
            meta: {
            title: 'Login',
            }
          },
        ]
    },
    {
        path: '/',
        component: Body,
        children: [
          {
            path: '',
            name: 'defaultRoot',
            component: Default,
            meta: {
              title: 'Dashboard',
              requiresAuth: true, 
            }
          },
        ]
      },
      {
        path: '/village-information',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "profile",
            name: "informasiDesa_profilDesa",
            component: IndexProfile,
            meta: {
              title: "Profil Desa",
            },
          },
        ]
      },
      {
        path: '/village-government',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: 'officials',
            name: 'Pemerintahan_perangakatDesa',
            component: IndexOfficials,
            meta: {
              title: 'Perangkat Desa',
            }
          },
          {
            path: 'tenure-periods',
            name: 'Pemerintahan_periodeJabatan',
            component: IndexTenurePeriods,
            meta: {
              title: 'Periode Jabatan',
            }
          },
        ]
      },
      {
        path: '/population',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "residents",
            name: "kependudukan_penduduk",
            component: IndexResident,
            meta: {
              title: "Penduduk",
            },
          },
          {
            path: "families",
            name: "kependudukan_keluarga",
            component: IndexUser,
            meta: {
              title: "Wilayah Administrasi",
            },
          },
          {
            path: "households",
            name: "kependudukan_rumahTangga",
            component: IndexUser,
            meta: {
              title: "Rumah Tangga",
            },
          },
          {
            path: "groups",
            name: "kependudukan_kelompok",
            component: IndexGroups,
            meta: {
              title: "Kelompok",
            },
          },
        ]
      },
      {
        path: '/documents',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "incoming-letters",
            name: "dokumen_suratMasuk",
            component: IndexUser,
            meta: {
              title: "Surat Masuk",
            },
          },
          {
            path: "outgoing-letters",
            name: "dokumen_suratKeluar",
            component: IndexUser,
            meta: {
              title: "Surat Keluar",
            },
          },
          {
            path: "regulations",
            name: "dokumen_peraturanRegulasi",
            component: IndexUser,
            meta: {
              title: "Peraturan/Regulasi",
            },
          },
          {
            path: "decrees",
            name: "dokumen_keptusanKepalaDesa",
            component: IndexUser,
            meta: {
              title: "Keputusan Kepala Desa",
            },
          },
        ]
      },
      {
        path: '/activities',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "programs",
            name: "kegiatan_program",
            component: IndexPrograms,
            meta: {
              title: "Program Kegiatan",
            },
          },
          {
            path: "categories",
            name: "kegiatan_kategori",
            component: IndexActivityCategories,
            meta: {
              title: "Kategori Kegiatan",
            },
          },
        ]
      },
      {
        path: '/cash-flow',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "income",
            name: "keuangan_pemasukan",
            component: IndexUser,
            meta: {
              title: "Pemasukan",
            },
          },
          {
            path: "expenses",
            name: "keuangan_pengeluaran",
            component: IndexUser,
            meta: {
              title: "Pengeluaran",
            },
          },
        ]
      },
      {
        path: '/assets',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "land",
            name: "aset_tanah",
            component: IndexUser,
            meta: {
              title: "Tanah",
            },
          },
          {
            path: "buildings",
            name: "aset_bangunan",
            component: IndexUser,
            meta: {
              title: "Bangunan",
            },
          },
          {
            path: "rooms",
            name: "aset_ruangan",
            component: IndexUser,
            meta: {
              title: "Ruangan",
            },
          },
          {
            path: "vehicles",
            name: "aset_kendaraan",
            component: IndexVehicles,
            meta: {
              title: "Kendaraan",
            },
          },
          {
            path: "equipment",
            name: "aset_peralatanMesin",
            component: IndexUser,
            meta: {
              title: "Peralatan dan Mesin",
            },
          },
          {
            path: "items",
            name: "aset_barang",
            component: indexItems,
            meta: {
              title: "Barang",
            },
          },
        ]
      },
      {
        path: '/land-affairs',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "parcels",
            name: "pertanahan_percil",
            component: IndexUser,
            meta: {
              title: "Data Percil",
            },
          },
          {
            path: "c-ledger",
            name: "pertanahan_cDesa",
            component: IndexUser,
            meta: {
              title: "C Desa",
            },
          },
        ]
      },
      {
        path: '/enterprise',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "profile",
            name: "badanusaha_profil",
            component: IndexProfileEnterprise,
            meta: {
              title: "Profil Usaha",
            },
          },
          {
            path: "management",
            name: "badanusaha_pengurus",
            component: IndexManagement,
            meta: {
              title: "Pengurus/Pengelola",
            },
          },
          {
            path: "reports",
            name: "badanUsaha_laporan",
            component: IndexReports,
            meta: {
              title: "Laporan Usaha",
            },
          },
        ]
      },
      {
        path: '/website',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "articles/list",
            name: "websiteArtikel_artikel",
            component: IndexUser,
            meta: {
              title: "Artikel",
            },
          },
          {
            path: "articles/categories",
            name: "websiteArtikel_kategori",
            component: IndexCategoryArticles,
            meta: {
              title: "Kategori Artikel",
            },
          },
          {
            path: "download/documents",
            name: "websiteDownload_dokumen",
            component: IndexDocument,
            meta: {
              title: "Dokumen",
            },
          },
          {
            path: "download/document-types",
            name: "websiteDownload_jenisDokumen",
            component: IndexDocumentTypes,
            meta: {
              title: "Jenis Dokumen",
            },
          },
        ]
      },

      {
        path: '/',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "banner",
            name: "banner",
            component: IndexBanner,
            meta: {
              title: "Banner",
            },
          },
        ]
      },
      {
        path: '/',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "services",
            name: "layanan",
            component: IndexServices,
            meta: {
              title: "Layanan",
            },
          },
        ]
      },
      {
        path: '/',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "notices",
            name: "pengumuman",
            component: IndexNotices,
            meta: {
              title: "Pengumuman",
            },
          },
        ]
      },
      {
        path: '/',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "related-links",
            name: "linkTerkait",
            component: IndexRelatedLinks,
            meta: {
              title: "Link Terkait",
            },
          },
        ]
      },

      {
        path: '/general',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "user",
            name: "general_pengguna",
            component: IndexUser,
            meta: {
              title: "Pengguna",
            },
          },
          {
            path: "roles",
            name: "general_roles",
            component: IndexRoles,
            meta: {
              title: "Roles",
            },
          },
          {
            path: 'regions',
            name: 'general_wilayah',
            component: IndexRegion,
            meta: {
              title: 'Data Wilayah',
            }
          },
        ]
      },
      {
        path: '/demographics',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: 'religions',
            name: 'demographics_agama',
            component: IndexReligion,
            meta: {
              title: 'Data Agama',
            }
          },
          {
            path: 'blood-types',
            name: 'demographics_golonganDarah',
            component: IndexBloodTypes,
            meta: {
              title: 'Data Golongan Darah',
            }
          },
          {
            path: 'family-relationships',
            name: 'demographics_hubunganKeluarga',
            component: IndexFamilyRelationships,
            meta: {
              title: 'Data Hubungan Keluarga',
            }
          },
          {
            path: 'genders',
            name: 'demographics_jenisKelamin',
            component: IndexGenders,
            meta: {
              title: 'Data Jenis Kelamin',
            }
          },
          {
            path: 'occupations',
            name: 'demographics_pekerjaan',
            component: IndexOccupations,
            meta: {
              title: 'Data Pekerjaan',
            }
          },
          {
            path: 'education-levels',
            name: 'demographics_pendidikan',
            component: IndexEducationLevels,
            meta: {
              title: 'Data Pendidikan',
            }
          },
          {
            path: 'birth-attendants',
            name: 'demographics_penolongKelahiran',
            component: IndexBirthAttendants,
            meta: {
              title: 'Data Penolong Kelahiran',
            }
          },
          {
            path: 'birth-places',
            name: 'demographics_tempatDilahirkan',
            component: IndexBirthPlaces,
            meta: {
              title: 'Data Tempat Dilahirkan',
            }
          },
          {
            path: 'martial-statuses',
            name: 'demographics_statusPerkawinan',
            component: IndexMartialStatuses,
            meta: {
              title: 'Data Status Perkawinan',
            }
          },
          {
            path: 'group-categories',
            name: 'demographics_kategoriKelompok',
            component: IndexGroupCategories,
            meta: {
              title: 'Data Kategori Kelompok',
            }
          },
        ]
      },
      {
        path: '/finance',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "budget-sources",
            name: "keuangan_sumberAnggaran",
            component: IndexBudgetSources,
            meta: {
              title: "Sumber Anggaran",
            },
          },
          {
            path: "account-codes",
            name: "keuangan_kodeRekening",
            component: IndexBudgetSources,
            meta: {
              title: "Kode Rekening",
            },
          },
        ]
      },
      {
        path: '/government',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "positions",
            name: "pemerintahan_jabatan",
            component: IndexPositions,
            meta: {
              title: "Jabatan",
            },
          },
          {
            path: "official-status",
            name: "pemerintahan_statusPerangkat",
            component: IndexOfficialStatus,
            meta: {
              title: "Status Perangkat",
            },
          },
        ]
      },
      {
        path: '/bumdes',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "business-fields",
            name: "bumdes_bidangUsaha",
            component: IndexBusinessFields,
            meta: {
              title: "Bidang Usaha",
            },
          },
          {
            path: "report-periods",
            name: "bumdes_periodeLaporan",
            component: IndexReportPeriods,
            meta: {
              title: "Periode Laporan Usaha",
            },
          },
        ]
      },
      {
        path: '/archives',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "incoming-letter-types",
            name: "dokumen_jenisSuratMasuk",
            component: IndexIncomingLetterTypes,
            meta: {
              title: "Jenis Surat Masuk",
            },
          },
          {
            path: "outgoing-letter-types",
            name: "dokumen_jenisSuratKeluar",
            component: IndexOutgoingLetterTypes,
            meta: {
              title: "Jenis Surat Keluar| Desa Online",
            },
          },
          {
            path: "regulation-types",
            name: "dokumen_jenisPeraturan",
            component: IndexRegulationTypes,
            meta: {
              title: "Jenis Peraturan/Regulasi",
            },
          },
        ]
      },
      {
        path: '/inventory',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "legal-status",
            name: "aset_statusHak",
            component: IndexLegalStatus,
            meta: {
              title: "Status Hak",
            },
          },
          {
            path: "land-origins",
            name: "aset_asalUsulTanah",
            component: IndexLandOrigins,
            meta: {
              title: "Asal Usul Tanah",
            },
          },
          {
            path: "acquisition-procedures",
            name: "aset_prosedurPenguasaan",
            component: IndexAcquisitionProcedures,
            meta: {
              title: "Prosedur Penguasaan",
            },
          },
          {
            path: "acquisitions",
            name: "aset_perolehan",
            component: IndexAcquisitions,
            meta: {
              title: "Perolehan",
            },
          },
          {
            path: "conditions",
            name: "aset_kondisi",
            component: IndexConditions,
            meta: {
              title: "Kondisi",
            },
          },
          {
            path: "multi-story-construction",
            name: "aset_kontuksiBertingkat",
            component: IndexMultiStoryConstruction,
            meta: {
              title: "Kontruksi Bertingkat",
            },
          },
          {
            path: "concrete-construction",
            name: "aset_kontruksiBeton",
            component: IndexConcreteConstruction,
            meta: {
              title: "Kontruksi Beton",
            },
          },
          {
            path: "physical-status",
            name: "aset_keberadaanFisik",
            component: IndexPhysicalStatus,
            meta: {
              title: "Keberadaan Fisik",
            },
          },
          {
            path: "item-categories",
            name: "aset_kategoriBarang",
            component: IndexItemCategories,
            meta: {
              title: "Kategori Barang",
            },
          },
        ]
      },


]
const router=createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('User')) {
      return next('/auth');
    }
  }
  next();
});

export default router;