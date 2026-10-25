export interface CatalogAnimal {
    id: string
    title: string
    species: string
    breed: string
    category: string
    weightKg: number | null
    vaccinated: boolean
    age: string
    location: string
    price: number
    unit: string
    seller: string
    rating: string
    deals: string
    badge: string
    extra: string
    note: string
    image: string
}

export const animals: CatalogAnimal[] = [
    {
        id: "demo-1",
        title: "Lote de 10 Borregos Dorper F1",
        species: "Ovino",
        breed: "Dorper F1",
        category: "Machos",
        weightKg: 38,
        vaccinated: true,
        age: "8 meses",
        location: "Hermosillo, Sonora",
        price: 3200,
        unit: "MXN / cabeza",
        seller: "Rancho Santa Elena",
        rating: "4.9",
        deals: "28 tratos",
        badge: "Disponible (10 cabezas)",
        extra: "Guía REEMO",
        note: "Fierro: #EL-491",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8VIK6PIcHnMEpJfUd8cEu5YC9lRbhXAIugNI1cP0yfK8adkS-3kaqUqBGvp-5YuD_jYZRLOILqYuFC-O0n7ah5dH_pGuuxWGhWtduUVACjGxAJRQRQYBwQGbQ71eC8WjWi4TP9Ky75BptqKi1EEP1b5BIrjDJk_ROzjzMPYkDRHrsxyQRy9Kc11RjArHl-ZOdDlRgc0Vt4n1s5gfQJnI7vfTr3IEw9reIxEdApmCBUUdXyYevxE5z",
    },
    {
        id: "demo-2",
        title: "Toro Semental Simmental Registro Puro",
        species: "Bovino",
        breed: "Simmental",
        category: "Semental",
        weightKg: 820,
        vaccinated: true,
        age: "24 meses",
        location: "Tepatitlán, Jal.",
        price: 48000,
        unit: "MXN",
        seller: "Cabaña Los Pinos",
        rating: "5.0",
        deals: "14 tratos",
        badge: "Disponible (1 cabeza)",
        extra: "Pedigree Oficial",
        note: "820 kg en báscula",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRcaLqSNEfpUX8qcmcYaJWPuhvgJCB_zNUO2ub2euk5A8xJxrq1_BiDfxhcGFkPHU-Ypaqz7WJdubJi1LAv6hwttaFALEnbGHXiIjW_yB8jtmoBqKHdHH5MEV6PTWO_69qpws8WZaxF7kZDu1VhprJJXeYYbIs3DPKWsnj26qPkHyRA2lHnxedsVXUBWe3sR-oA5VMp3hAHH5dShLhaVcVwYDFWNCXLT_kmAIreQhs0FETNRuu10yA",
    },
    {
        id: "demo-3",
        title: "Lote 25 Vaquillas Angus Negro preñadas",
        species: "Bovino",
        breed: "Angus Negro",
        category: "Hembras preñadas",
        weightKg: 420,
        vaccinated: true,
        age: "18 meses",
        location: "Chihuahua, Chih.",
        price: 28500,
        unit: "MXN / cab.",
        seller: "Ganadera Del Norte",
        rating: "",
        deals: "En proceso de anticipo",
        badge: "Reservada",
        extra: "25 cabezas",
        note: "",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp1l66iX6IIa2_7Lq2x0VHPEZC28kdcItXfUpRLElpW7l65yZFjMy6mvM7EygKouic0867weHEQmyA0qnDeBFKh_ZRSyQUfXk9GIx61Uyv6P2dnSCbsSqV17yyPDSw9etwa32qdOkPdu59yBN2BZ44y3CkLipXuNJw9F2h-npLg2IhHCIWVYrAsgjYDsJ1q55F68OAZU8_1O6eN4dyiS3nyN7h2kiLoONuGdoFMJlb3eZVwKN6lCPJ",
    },
    {
        id: "demo-4",
        title: "Lechones Pietrain x Landrace destete (Lote de 15)",
        species: "Porcino",
        breed: "Pietrain x Landrace",
        category: "Mixto",
        weightKg: 14,
        vaccinated: true,
        age: "45 días",
        location: "La Piedad, Michoac.",
        price: 1450,
        unit: "MXN / cabeza",
        seller: "Granja San Miguel",
        rating: "4.8",
        deals: "42 tratos",
        badge: "Disponible (15 cabezas)",
        extra: "Desparasitados",
        note: "Promedio 14 kg",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCccBumUL-sIajq4iFL9e5rgEsQMOy0MLk7sXxp2-M1PcIWx6J-AF0luzSBa6DYUB7OKgDkGgwtzbEa6BIEV-BrSek0gpihc_lsRPAdkVBRHokvpTOc8g_dhxpiEhE_SJCTt57L2wVVra117qkjMdHGO_QdwVgdPMZVjW266fjPT7SQwzO54OhjTXgBxy2Wv0BLrrVVmb9wxQ6oDftznP6LLFgZOtQlC6ect9Xo_BrFGzqCD5ib6uxH",
    },
    {
        id: "demo-5",
        title: "Novillos de Engorda Brangus Rojo (Lote 12)",
        species: "Bovino",
        breed: "Brangus Rojo",
        category: "Machos de engorda",
        weightKg: 340,
        vaccinated: true,
        age: "14 meses",
        location: "Navojoa, Sonora",
        price: 22000,
        unit: "MXN / cab.",
        seller: "Corrales El Yaqui",
        rating: "4.9",
        deals: "19 tratos",
        badge: "Disponible (12 cabezas)",
        extra: "340 kg prom.",
        note: "Hato Libre TB",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS8G3jLfEY1ooBoACMN5ncWBZ8xH_tP1IjKiXExDy8RQaCV9QwCBFZXhAskacIgv20yJESe43iHR4AS8bLBLylwNWxdOX6WuT5hPy8cpdXjbNEOrrP-2VmdxicaI93r7VA0k_qnTV36rDDbTVe4E1nU2Id3weQ3K1EKNGuscmLW4GXjJfZMyopz36Ns0BE3x1f8Kpq9jYDJJvSV9TWqxiizygypowmalVj0V52MGW4YLkMFN5eNjTX",
    },
    {
        id: "demo-6",
        title: "Borregas Pelibuey primer parto",
        species: "Ovino",
        breed: "Pelibuey",
        category: "Hembras",
        weightKg: 45,
        vaccinated: false,
        age: "12 meses",
        location: "Mérida, Yucatán",
        price: 2800,
        unit: "MXN / cab.",
        seller: "Ovinos del Mayab",
        rating: "4.7",
        deals: "11 tratos",
        badge: "Disponible (8 cabezas)",
        extra: "Aptas Cría",
        note: "Rústicas de trópico",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1RZv39lDtTKLz2A_5QNHL3-2seF9mpy5-58HemidpS75VfBI8nF4ZNCoMV9-FFVWeoeaYF47oMQQeQa5LhfvhxnTuwISl812nQ5fhLEehqiQv5GZIB7rqLWrfTkbrZjIwblSBC_4ZQF_cuqHuOvbOkn3ZnqNSVXuos2ZzZsBcVR4qn_NMu--J7ehaaiygQKpK9mBjHp_tFO_Mc676ntBILxGiZQgYvteXS4Ajxyq-Uvt9VOf3LABC",
    },
];
