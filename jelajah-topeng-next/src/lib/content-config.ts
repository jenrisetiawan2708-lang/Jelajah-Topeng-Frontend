// Konfigurasi & tipe bersama (aman dipakai di server maupun client).

export const KINDS = [
  "exploration",
  "panji",
  "materi",
  "booking",
  "progres",
  "ticketing",
  "payment",
  "notification",
  "faq",
  "users",
] as const;

export type RecordKind = (typeof KINDS)[number];

export type RecordDTO = {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  amount: string;
  status: string;
  createdAt: string;
  correctAnswer: string;
  correctClue: string;
  imageUrl: string;
  eventDate: string;
};

export type RecordDraft = Omit<RecordDTO, "id" | "createdAt">;
export type RecordsByKind = Record<RecordKind, RecordDTO[]>;

export function emptyRecords(): RecordsByKind {
  return Object.fromEntries(KINDS.map((kind) => [kind, []])) as unknown as RecordsByKind;
}

// Bentuk state yang dikembalikan Server Action ke useActionState.
export type FieldErrors = Partial<Record<string, string[]>>;
export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
  ts?: number;
};

export const WILAYAH_SUGGESTIONS = [
  "Polowijen",
  "Blimbing",
  "Lowokwaru",
  "Klojen",
  "Kedungkandang",
  "Sukun",
  "Kota Malang",
  "Kabupaten Malang",
];

type SeedRecord = Pick<
  RecordDraft,
  "name" | "description" | "location" | "date" | "amount" | "status"
>;

export type ContentProfile = {
  fields: [string, string, string, string, string];
  statuses: string[];
  records: SeedRecord[];
};

// Labels and starter records follow the visitor journeys in the IA.
export const CONTENT_PROFILES: Record<RecordKind, ContentProfile> = {
  exploration: {
    fields: ["Nama lokasi", "Informasi", "Wilayah", "Tahun", "Catatan"],
    statuses: ["Aktif", "Draft", "Nonaktif"],
    records: [
      {
        name: "Makam Mbah Reni",
        description: "Titik budaya untuk dijelajahi.",
        location: "",
        date: "",
        amount: "",
        status: "Aktif",
      },
    ],
  },

  panji: {
    fields: ["Nama game", "Rincian game", "Jawaban benar", "Clue", "Gambar"],
    statuses: ["Aktif"],
    records: [],
  },

  materi: {
    fields: [
      "Judul materi",
      "Ringkasan",
      "Maestro",
      "Jumlah subbab",
      "Catatan",
    ],
    statuses: ["Tersedia", "Perlu dilengkapi"],
    records: [
      {
        name: "Makam Mbah Reni",
        description: "Materi budaya dengan 3 subbab.",
        location: "Ki Sujono",
        date: "",
        amount: "3 subbab",
        status: "Tersedia",
      },
      {
        name: "Situs Sumur Windu",
        description: "Materi budaya dengan 3 subbab.",
        location: "Ki Sujono",
        date: "",
        amount: "3 subbab",
        status: "Tersedia",
      },
      {
        name: "Mandala Empu Purwa",
        description: "Materi budaya dengan 3 subbab.",
        location: "Ki Sujono",
        date: "",
        amount: "3 subbab",
        status: "Tersedia",
      },
      {
        name: "Situs Joko Lolo",
        description: "Materi budaya dengan 3 subbab.",
        location: "Ki Sujono",
        date: "",
        amount: "3 subbab",
        status: "Tersedia",
      },
    ],
  },

  booking: {
    fields: ["Nama sesi", "Informasi", "Tempat", "Durasi", "Catatan"],
    statuses: ["Booking", "Perlu konfirmasi"],
    records: [
      {
        name: "Booking Sesi Ki Sujono",
        description: "Sesi bersama Ki Sujono.",
        location: "Tempat Sanggar Topeng",
        date: "",
        amount: "90 menit",
        status: "Booking",
      },
    ],
  },

  progres: {
    fields: ["Nama peserta", "Progres", "Peringkat", "Tanggal", "Capaian"],
    statuses: ["Peserta", "Belum ada data"],
    records: [
      {
        name: "Raja Esa Abdilah",
        description: "Progres belajar: 4 dari 5.",
        location: "",
        date: "",
        amount: "4/5",
        status: "Peserta",
      },
      {
        name: "Jenri Setiawan Sitepu",
        description: "Progres belajar: 2 dari 5.",
        location: "",
        date: "",
        amount: "2/5",
        status: "Peserta",
      },
      {
        name: "Ardli Miftah",
        description: "Progres belajar: 0 dari 5.",
        location: "",
        date: "",
        amount: "0/5",
        status: "Peserta",
      },
    ],
  },

  ticketing: {
    fields: ["Nama paket", "Fasilitas", "Lokasi", "Tanggal", "Harga"],
    statuses: ["Detail tersedia", "Detail belum tersedia"],
    records: [
      {
        name: "Paket Sumbang Kampung",
        description:
          "Maksimal 30 orang. Termasuk pembelajaran budaya, tari/topeng tradisional, dokumentasi, demo batik/topeng, camilan, dan minuman. Tambahan makan Rp20.000/orang.",
        location: "",
        date: "",
        amount: "Rp1.000.000 · tambahan peserta Rp25.000/orang",
        status: "Detail tersedia",
      },
      {
        name: "Paket Sobo Pawon",
        description: "Informasi paket belum tersedia.",
        location: "",
        date: "",
        amount: "",
        status: "Detail belum tersedia",
      },
      {
        name: "Paket Medayoh",
        description: "Informasi paket belum tersedia.",
        location: "",
        date: "",
        amount: "",
        status: "Detail belum tersedia",
      },
      {
        name: "Paket Selametan/Metri",
        description: "Informasi paket belum tersedia.",
        location: "",
        date: "",
        amount: "",
        status: "Detail belum tersedia",
      },
      {
        name: "Paket Hasfa Karya",
        description: "Informasi paket belum tersedia.",
        location: "",
        date: "",
        amount: "",
        status: "Detail belum tersedia",
      },
    ],
  },

  payment: {
    fields: ["Kode transaksi", "Rincian", "Lokasi", "Tanggal", "Jumlah"],
    statuses: ["Belum ada data"],
    records: [],
  },

  notification: {
    fields: ["Judul", "Isi", "Penerima", "Tanggal", "Catatan"],
    statuses: ["Belum ada data"],
    records: [],
  },

  faq: {
    fields: ["Pertanyaan", "Jawaban", "Kategori", "Tanggal", "Catatan"],
    statuses: ["Belum ada data"],
    records: [],
  },

  users: {
    fields: [
      "Nama pengguna",
      "Informasi profil",
      "Email",
      "Tanggal",
      "Catatan",
    ],
    statuses: ["Belum ada data"],
    records: [],
  },
};