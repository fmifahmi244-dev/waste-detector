// Data referensi kategori pemilahan sampah sesuai standar pengelolaan limbah
export const wasteCategories = {
  organik: {
    id: 'organik',
    label: 'Organik',
    binColor: 'Hijau',
    description:
      'Limbah yang berasal dari sisa makhluk hidup dan dapat terurai secara biologis oleh mikroorganisme tanah.',
    examples: [
      'Sisa makanan, nasi, dan sayuran',
      'Kulit buah dan sisa bahan dapur',
      'Daun gugur, ranting, dan rumput',
      'Ampas kopi dan kantong teh kertas',
      'Kertas karton tanpa lapisan plastik',
    ],
    disposal: [
      'Tempatkan pada wadah sampah berwarna hijau.',
      'Pisahkan dari kantong plastik pembungkus sebelum dibuang.',
      'Dapat diolah menjadi pupuk kompos atau pakan ternak.',
      'Pastikan saluran pembuangan tidak tergenang cairan residu asam.',
    ],
    impact:
      'Pengolahan kompos mandiri dapat mengurangi beban timbulan sampah di tempat pembuangan akhir hingga 40 persen.',
    recycleTime: '2 minggu sampai 6 bulan',
  },
  anorganik: {
    id: 'anorganik',
    label: 'Anorganik',
    binColor: 'Kuning / Biru',
    description:
      'Limbah dari bahan non-hayati atau proses industri yang sulit terurai secara alami, namun sebagian besar bernilai daur ulang.',
    examples: [
      'Botol minuman PET dan kemasan detergen HDPE',
      'Kaleng minuman aluminium dan kaleng biskuit',
      'Kardus kering dan kertas kantor',
      'Botol dan toples kaca bening atau berwarna',
      'Pipa PVC dan perkakas logam bekas',
    ],
    disposal: [
      'Tempatkan pada wadah sampah berwarna biru atau kuning.',
      'Bilas sisa cairan atau minyak sebelum dikumpulkan.',
      'Lipat atau pipihkan wadah kardus untuk menghemat ruang tampung.',
      'Salurkan ke fasilitas bank sampah atau unit daur ulang berizin.',
    ],
    impact:
      'Mendaur ulang satu kaleng aluminium menghemat energi hingga 95 persen dibanding pengolahan bijih bauksit mentah.',
    recycleTime: '20 sampai 500 tahun tanpa proses daur ulang',
  },
  residu: {
    id: 'residu',
    label: 'Residu',
    binColor: 'Abu-abu / Merah',
    description:
      'Limbah yang tidak dapat didaur ulang secara ekonomis dan tidak dapat terurai, memerlukan pemrosesan akhir di fasilitas sanitasi.',
    examples: [
      'Popok bayi dan pembalut sekali pakai',
      'Kemasan sachet laminasi multipel',
      'Styrofoam dan busa kemasan makanan',
      'Puntung rokok dan abu pembakaran',
      'Kertas foto, kertas minyak, dan lakban kotor',
    ],
    disposal: [
      'Tempatkan pada wadah limbah residu tertutup.',
      'Bungkus rapat limbah higienis dan sanitasi.',
      'Jangan membakar limbah residu di pekarangan terbuka.',
      'Serahkan ke armada pengangkutan resmi menuju TPA berizin.',
    ],
    impact:
      'Limbah residu yang tidak dikelola di fasilitas sanitasi berisiko melepaskan zat mikroplastik dan mencemari air tanah.',
    recycleTime: 'Lebih dari 100 tahun dengan risiko pelepasan polutan',
  },
};

export const getCategoryData = (label) => {
  if (!label) return null;
  const key = String(label).toLowerCase().trim();
  return wasteCategories[key] || null;
};
