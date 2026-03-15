const INITIAL_SETTINGS = {
    storeName: 'كاسترو للأثاث',
    phone: '0599000000',
    welcomeMessage: 'مرحباً بك في متجر كاسترو للأثاث - فخامة التفاصيل',
    primaryColor: '#d32f2f'
};

const INITIAL_PRODUCTS = [
    {
        id: '101',
        name: 'طقم كنب إيطالي فاخر',
        price: 4500,
        oldPrice: 5200,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
        category: 'living-rooms',
        description: 'طقم كنب إيطالي بتصميم عصري ومريح، مصنوع من أجود أنواع الأقمشة المقاومة للبقع. يتسع لـ 7 أشخاص.',
        inStock: true,
        variants: [
            { name: 'رمادي رماد', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
            { name: 'بيج صحراوي', image: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&q=80&w=800' },
            { name: 'أزرق ملكي', image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800' }
        ],
        images: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1556909167-2f56708703a5?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        id: '102',
        name: 'غرفة نوم ماستر مودرن',
        price: 8900,
        oldPrice: 10500,
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
        category: 'bedrooms',
        description: 'غرفة نوم كاملة تشمل سرير مزدوج، خزائن جانبية، وتسريحة. خشب زان طبيعي مع تشطيبات عالية الجودة.',
        inStock: true,
        variants: [
            { name: 'أبيض لؤلؤي', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800' },
            { name: 'خشب طبيعي غامق', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800' }
        ],
        images: [
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        id: '103',
        name: 'طاولة طعام خشب بلوط',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
        category: 'dining',
        description: 'طاولة طعام تتسع لـ 6 أشخاص، مصنوعة من خشب البلوط المتين مع كراسي منجدة بقماش فاخر.',
        inStock: true,
        variants: [
            { name: 'خشب فاتح', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800' },
            { name: 'خشب بني محروق', image: 'https://images.unsplash.com/photo-1577146333355-630f9d510e1a?auto=format&fit=crop&q=80&w=800' }
        ]
    },
    {
        id: '104',
        name: 'مكتب عمل تنفيذي',
        price: 1800,
        oldPrice: 2200,
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
        category: 'office',
        description: 'مكتب عمل بتصميم أنيق وعملي، يوفر مساحة تخزين واسعة وسطح عمل مريح.',
        inStock: true,
        variants: [
            { name: 'أسود', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800' },
            { name: 'بني كلاسيك', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800' }
        ]
    },
    {
        id: '105',
        name: 'إضاءة سقف مودرن',
        price: 450,
        image: 'https://images.unsplash.com/photo-1513506003013-194a5d68d8ed?auto=format&fit=crop&q=80&w=800',
        category: 'accessories',
        description: 'ثريا سقف بتصميم عصري، تضفي لمسة جمالية ودافئة على أي غرفة.',
        inStock: true,
        variants: [
            { name: 'ذهبي', image: 'https://images.unsplash.com/photo-1513506003013-194a5d68d8ed?auto=format&fit=crop&q=80&w=800' },
            { name: 'فضى', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800' }
        ]
    },
    {
        id: '106',
        name: 'كنبة زاوية حرف L',
        price: 3800,
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
        category: 'living-rooms',
        description: 'كنبة زاوية مريحة جداً، مثالية لغرف المعيشة العائلية.',
        inStock: false,
        variants: [
            { name: 'رمادي فاتح', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800' },
            { name: 'كحلي', image: 'https://images.unsplash.com/photo-1555504146-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' }
        ]
    }
];

const INITIAL_CATEGORIES = [
    { slug: 'living-rooms', label: 'غرف المعيشة', icon: 'ph ph-couch' },
    { slug: 'bedrooms', label: 'غرف النوم', icon: 'ph ph-bed' },
    { slug: 'dining', label: 'غرف الطعام', icon: 'ph ph-cooking-pot' },
    { slug: 'office', label: 'المكاتب', icon: 'ph ph-desktop' },
    { slug: 'accessories', label: 'إكسسوارات', icon: 'ph ph-lamp' }
];
