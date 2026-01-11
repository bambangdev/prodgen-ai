import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Download, Settings, X, AlertCircle, Server, Layers, RefreshCw, User, Shirt, Utensils, Car, Leaf, LayoutGrid, Tag, FileText, Refrigerator, Pill, Monitor, BookOpen, Gamepad2, Baby, CheckSquare, Square, Smartphone, MonitorPlay, RectangleVertical, Camera, Coins, Zap, Info, ShieldCheck, ShieldAlert } from 'lucide-react';

// --- Types ---
type CategoryType = 'fashion' | 'kids-fashion' | 'food' | 'kitchen' | 'beauty' | 'medicine' | 'herbal' | 'automotive' | 'electronics' | 'ebook' | 'toys';
type EngineType = 'gemini-nano' | 'huggingface';
type ModelType = 'no-model' | 'indo' | 'bule' | 'mannequin' | 'hand-model';
type GenderType = 'male' | 'female';
type PoseStyle = 'standard' | 'casual' | 'gen-z' | 'formal' | 'candid' | 'cinematic';
type AspectRatioType = '1:1' | '9:16' | '16:9' | '4:5' | '3:4';
type QualityMode = 'eco' | 'hd'; 
type AccountTier = 'free' | 'paid';

interface CaptionData {
    title: string;
    desc: string;
    price: string;
}

interface GeneratedMedia {
  id: number;
  url: string;
  type: 'image';
  style: string;
  ratio: AspectRatioType;
  caption?: CaptionData;
}

const BACKGROUND_OPTIONS: Record<string, {id: string, label: string}[]> = {
    fashion: [
        {id: 'studio', label: 'Studio Clean'},
        {id: 'street', label: 'Urban Street'},
        {id: 'cafe', label: 'Cafe Aesthetic'},
        {id: 'nature', label: 'Nature Park'},
        {id: 'luxury', label: 'Luxury Hall'},
        {id: 'beach', label: 'Tropical Beach'}
    ],
    'kids-fashion': [
        {id: 'playground', label: 'Playground'},
        {id: 'kids-room', label: 'Colorful Room'},
        {id: 'park', label: 'Sunny Park'},
        {id: 'studio-fun', label: 'Fun Studio'},
        {id: 'school', label: 'School/Classroom'},
        {id: 'garden', label: 'Home Garden'}
    ],
    food: [
        {id: 'wooden-table', label: 'Meja Kayu'},
        {id: 'marble-top', label: 'Marmer Mewah'},
        {id: 'picnic', label: 'Piknik Outdoor'},
        {id: 'restaurant', label: 'Restoran'},
        {id: 'kitchen', label: 'Dapur Modern'},
        {id: 'dark-moody', label: 'Dark & Moody'}
    ],
    kitchen: [
        {id: 'modern-kitchen', label: 'Dapur Modern'},
        {id: 'rustic-kitchen', label: 'Dapur Klasik'},
        {id: 'chef-table', label: 'Meja Koki'},
        {id: 'dining-room', label: 'Ruang Makan'},
        {id: 'sink-area', label: 'Area Wastafel'},
        {id: 'pantry', label: 'Lemari Pantry'}
    ],
    beauty: [
        {id: 'water-splash', label: 'Cipratan Air'},
        {id: 'vanity', label: 'Meja Rias'},
        {id: 'silk-sheets', label: 'Kain Sutra'},
        {id: 'bathroom', label: 'Kamar Mandi'},
        {id: 'pastel-podium', label: 'Podium Pastel'},
        {id: 'flowers', label: 'Dekorasi Bunga'}
    ],
    medicine: [
        {id: 'pharmacy', label: 'Rak Farmasi'},
        {id: 'lab', label: 'Laboratorium'},
        {id: 'medical-table', label: 'Meja Medis'},
        {id: 'clean-white', label: 'Putih Steril'},
        {id: 'cabinet', label: 'Lemari Obat'},
        {id: 'hospital', label: 'Rumah Sakit'}
    ],
    automotive: [
        {id: 'garage', label: 'Garasi Modern'},
        {id: 'highway', label: 'Jalan Raya'},
        {id: 'showroom', label: 'Showroom'},
        {id: 'mountain-road', label: 'Jalan Gunung'},
        {id: 'city-night', label: 'Kota Malam Hari'},
        {id: 'desert', label: 'Padang Pasir'}
    ],
    electronics: [
        {id: 'gaming-setup', label: 'Gaming Setup'},
        {id: 'office-desk', label: 'Meja Kantor'},
        {id: 'minimalist-tech', label: 'Minimalis Tech'},
        {id: 'cyberpunk', label: 'Cyberpunk Neon'},
        {id: 'living-room', label: 'Ruang Tamu'},
        {id: 'studio-dark', label: 'Studio Gelap'}
    ],
    herbal: [
        {id: 'leaves', label: 'Dedaunan Hijau'},
        {id: 'sunlight', label: 'Cahaya Pagi'},
        {id: 'wooden-board', label: 'Papan Kayu'},
        {id: 'forest', label: 'Hutan Alami'},
        {id: 'zen-stone', label: 'Batu Zen'},
        {id: 'kitchen-window', label: 'Jendela Dapur'}
    ],
    ebook: [
        {id: 'reading-nook', label: 'Pojok Baca'},
        {id: 'wooden-desk', label: 'Meja Belajar'},
        {id: 'library', label: 'Rak Buku'},
        {id: 'tablet-mockup', label: 'Tablet Display'},
        {id: 'coffee-shop', label: 'Kafe'},
        {id: 'bed-side', label: 'Samping Tempat Tidur'}
    ],
    toys: [
        {id: 'playroom', label: 'Ruang Bermain'},
        {id: 'grass', label: 'Rumput Hijau'},
        {id: 'abstract-color', label: 'Warna Abstrak'},
        {id: 'preschool', label: 'Sekolah TK'},
        {id: 'shelf', label: 'Rak Mainan'},
        {id: 'sandpit', label: 'Area Pasir'}
    ]
};

const compressImage = (base64Str: string, maxWidth: number = 512): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onerror = () => reject(new Error("Gagal membaca gambar"));
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.imageSmoothingQuality = 'high';
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
    });
};

const CategoryBtn = ({ id, activeCategory, setActiveCategory, setBgStyle, icon: Icon, label }: { id: CategoryType, activeCategory: string, setActiveCategory: any, setBgStyle: any, icon: any, label: string }) => (
    <button 
        onClick={() => { 
            setActiveCategory(id); 
            setBgStyle(BACKGROUND_OPTIONS[id] ? BACKGROUND_OPTIONS[id][0].id : 'studio'); 
        }}
        className={`w-auto md:w-full flex-shrink-0 flex flex-col items-center justify-center py-3 px-1 gap-1 transition-all border-b-4 md:border-b-0 md:border-l-4 ${activeCategory === id ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        style={{ minWidth: '70px' }}
    >
        <Icon className={`w-5 h-5 ${activeCategory === id ? 'stroke-[2.5px]' : ''}`} />
        <span className="text-[10px] font-bold text-center leading-tight whitespace-nowrap md:whitespace-normal">{label}</span>
    </button>
);

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State Pengaturan
  const [activeCategory, setActiveCategory] = useState<CategoryType>('fashion');
  const [bgStyle, setBgStyle] = useState<string>('studio');
  const [modelType, setModelType] = useState<ModelType>('no-model');
  const [gender, setGender] = useState<GenderType>('female'); 
  const [useHijab, setUseHijab] = useState(false); 
  const [poseStyle, setPoseStyle] = useState<PoseStyle>('standard');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [imageCount, setImageCount] = useState<number>(1);
  const [engine, setEngine] = useState<EngineType>('gemini-nano');
  const [qualityMode, setQualityMode] = useState<QualityMode>('eco');
  const [accountTier, setAccountTier] = useState<AccountTier>('free');
  
  const [productContext, setProductContext] = useState('');
  const [enableCaption, setEnableCaption] = useState(false);
  const [captionData, setCaptionData] = useState<CaptionData>({ title: '', desc: '', price: '' });

  const [hfToken, setHfToken] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setGeneratedMedia([]); 
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCosts = () => {
      if (engine === 'huggingface' || (engine === 'gemini-nano' && accountTier === 'free')) {
          return { tokens: 0, idr: 0, free: true };
      }
      let tokensPerImage = qualityMode === 'eco' ? 258 : 1024;
      let totalInputTokens = tokensPerImage * imageCount;
      let baseCostPerImage = qualityMode === 'eco' ? 550 : 950; 
      let estimatedIdr = (baseCostPerImage * imageCount) * 1.11;
      return { tokens: totalInputTokens, idr: Math.ceil(estimatedIdr), free: false };
  };

  const currentCosts = calculateCosts();

  const getImagePrompt = (category: CategoryType, style: string, model: ModelType, gen: GenderType, hijab: boolean, pose: PoseStyle, ratio: AspectRatioType, context: string) => {
    let p = `Inpaint product: ${context || 'item'}. `;
    let m = "";
    if (model !== 'no-model' && model !== 'hand-model') {
        let h = (gen === 'female' && hijab) ? "hijab " : "";
        m = `Model: ${gen} ${model === 'indo' ? 'Asian' : 'Western'} ${h}model, pose: ${pose}. `;
    } else if (model === 'hand-model') {
        m = `Held by ${gen} hand. `;
    }
    return `${m}Bg: ${style}. Ratio: ${ratio}. 8k photorealistic. Keep product shape exactly.`;
  };

  const generateImageGemini = async (base64Image: string) => {
    console.log("Memanggil API Gemini...");
    try {
        const cleanBase64 = base64Image.split(',')[1];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiKey}`;
        const prompt = getImagePrompt(activeCategory, bgStyle, modelType, gender, useHijab, poseStyle, aspectRatio, productContext);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }] }],
                generationConfig: { 
                  responseModalities: ["TEXT", "IMAGE"], 
                  temperature: 0.4 
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error("API Response Error:", errData);
            if (response.status === 429) throw new Error("Limit Free Tier tercapai (15 req/menit). Tunggu 1 menit.");
            if (response.status === 403) throw new Error("API Key salah atau fitur Generative Language belum aktif di Google Cloud.");
            throw new Error(errData.error?.message || "Terjadi kesalahan pada server Gemini.");
        }
        
        const data = await response.json();
        const imgPart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        if (!imgPart) throw new Error("API berhasil dipanggil tetapi tidak mengembalikan gambar. Coba ganti latar belakang.");
        
        return `data:image/jpeg;base64,${imgPart.inlineData.data}`;
    } catch (e) { 
        console.error("Fetch Exception:", e);
        throw e; 
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) { setErrorMsg("Pilih foto produk dulu."); return; }
    if (isGenerating) return;
    
    if (engine === 'gemini-nano' && !geminiKey) { 
        setErrorMsg("API Key belum diisi. Masukkan di menu Server."); 
        setShowApiSettings(true); 
        return; 
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedMedia([]); 

    try {
        const targetWidth = qualityMode === 'eco' ? 512 : 1024;
        setProgressMsg(`Mengompres Foto (${qualityMode.toUpperCase()})...`);
        const optimizedImage = await compressImage(uploadedImage, targetWidth);

        for (let i = 0; i < imageCount; i++) {
            setProgressMsg(`Photoshoot ${i + 1}/${imageCount}...`);
            let resultUrl = "";
            
            if (engine === 'gemini-nano') {
                resultUrl = await generateImageGemini(optimizedImage);
            } else {
                const MODEL_URL = "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix";
                const response = await fetch(MODEL_URL, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${hfToken.trim()}` },
                    body: JSON.stringify({ inputs: optimizedImage, parameters: { prompt: `Place in ${bgStyle} background` } }),
                });
                if (!response.ok) throw new Error("Server HuggingFace sedang sibuk. Coba ganti engine ke Gemini.");
                const blob = await response.blob();
                resultUrl = URL.createObjectURL(blob);
            }

            if (resultUrl) {
                setGeneratedMedia(prev => [...prev, { 
                    id: Date.now() + i, 
                    url: resultUrl, 
                    type: 'image', 
                    style: bgStyle, 
                    ratio: aspectRatio, 
                    caption: enableCaption ? {...captionData} : undefined 
                }]);
            }
        }
    } catch (err: any) {
        setErrorMsg(err.message || "Terjadi kesalahan sistem saat memproses gambar.");
    } finally {
        setIsGenerating(false);
        setProgressMsg('');
    }
  };

  const handleDownload = (media: GeneratedMedia) => {
      const link = document.createElement('a');
      link.download = `prodgen-${media.id}.jpg`;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = media.url;
      image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          link.href = canvas.toDataURL('image/jpeg');
          link.click();
      };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col h-screen overflow-hidden">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 shrink-0 z-50 h-16 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                  <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none">ProdGen <span className="text-indigo-600">Pro</span></h1>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">AI Studio v2.5.1</p>
              </div>
            </div>
            <button 
                onClick={() => setShowApiSettings(!showApiSettings)}
                className={`p-2 rounded-lg border flex items-center gap-2 text-xs font-bold transition ${showApiSettings ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}
            >
                <Server className="w-4 h-4" /> <span className="hidden md:inline">Server Settings</span>
            </button>
      </nav>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          
          <div className="w-full md:w-20 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-row md:flex-col py-2 md:py-4 gap-1 shrink-0 overflow-x-auto md:overflow-y-auto hide-scrollbar z-40">
               <CategoryBtn id="fashion" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Shirt} label="Fashion" />
               <CategoryBtn id="kids-fashion" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Baby} label="Anak" />
               <CategoryBtn id="food" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Utensils} label="Makanan" />
               <CategoryBtn id="kitchen" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Refrigerator} label="Dapur" />
               <CategoryBtn id="beauty" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Sparkles} label="Skincare" />
               <CategoryBtn id="medicine" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Pill} label="Obat" />
               <CategoryBtn id="herbal" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Leaf} label="Herbal" />
               <CategoryBtn id="automotive" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Car} label="Otomotif" />
               <CategoryBtn id="electronics" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Monitor} label="Gadget" />
               <CategoryBtn id="ebook" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={BookOpen} label="E-Book" />
               <CategoryBtn id="toys" activeCategory={activeCategory} setActiveCategory={setActiveCategory} setBgStyle={setBgStyle} icon={Gamepad2} label="Mainan" />
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            
            <div className={`absolute md:static inset-0 z-30 bg-slate-50 md:block w-full md:w-[380px] border-r border-slate-200 flex flex-col overflow-y-auto p-4 md:p-6 gap-6 ${generatedMedia.length > 0 && !isGenerating ? 'hidden md:flex' : 'flex'}`}>
                
                {showApiSettings && (
                    <div className="bg-white border border-indigo-100 p-4 rounded-xl shadow-sm border-l-4 border-l-indigo-600 animate-in slide-in-from-top-2">
                        <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase">Server & Billing</label>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-3">
                            <button onClick={() => setEngine('gemini-nano')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${engine === 'gemini-nano' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Gemini AI</button>
                            <button onClick={() => setEngine('huggingface')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${engine === 'huggingface' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>HuggingFace</button>
                        </div>

                        {engine === 'gemini-nano' && (
                            <div className="mb-4">
                                <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Tipe Akun Gemini</label>
                                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                    <button onClick={() => setAccountTier('free')} className={`flex-1 py-1 text-[9px] font-bold rounded transition ${accountTier === 'free' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}>Free Tier</button>
                                    <button onClick={() => setAccountTier('paid')} className={`flex-1 py-1 text-[9px] font-bold rounded transition ${accountTier === 'paid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Paid Tier</button>
                                </div>
                                {accountTier === 'free' && (
                                    <p className="text-[9px] text-orange-600 mt-2 flex gap-1 items-start bg-orange-50 p-2 rounded">
                                        <ShieldAlert className="w-3 h-3 shrink-0" />
                                        <span>Data input akan digunakan Google untuk melatih AI mereka. Limit ketat 15 req/menit.</span>
                                    </p>
                                )}
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">API Keys</label>
                            <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="Google Gemini Key (AIza...)" className="w-full text-xs p-2 border rounded-lg bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500"/>
                            <input type="password" value={hfToken} onChange={(e) => setHfToken(e.target.value)} placeholder="Hugging Face Token" className="w-full text-xs p-2 border rounded-lg bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500"/>
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Upload className="w-4 h-4"/> 1. Upload Foto</h2>
                    {!uploadedImage ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-100/50 hover:bg-white transition relative">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="bg-white p-3 rounded-full shadow-sm w-fit mx-auto mb-2"><ImageIcon className="w-6 h-6 text-indigo-500" /></div>
                            <p className="text-xs font-medium text-slate-500">Klik untuk pilih foto produk</p>
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                            <img src={uploadedImage} alt="Preview" className="w-full h-40 object-contain bg-slate-200" />
                            <button onClick={() => {setUploadedImage(null); setGeneratedMedia([])}} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-white shadow-md transition"><X className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold text-indigo-900 flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500"/> Mode Hemat Piksel</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setQualityMode('eco')} className={`flex-1 p-2 rounded-lg border transition text-center ${qualityMode === 'eco' ? 'bg-white border-green-500 shadow-sm ring-1 ring-green-500 font-bold text-green-700' : 'bg-transparent border-indigo-200 text-indigo-700/60'}`}>
                            Eco (512px)
                        </button>
                        <button onClick={() => setQualityMode('hd')} className={`flex-1 p-2 rounded-lg border transition text-center ${qualityMode === 'hd' ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600 font-bold text-indigo-700' : 'bg-transparent border-indigo-200 text-indigo-700/60'}`}>
                            HD (1024px)
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Settings className="w-4 h-4"/> 2. Visual Studio</h2>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider text-[10px]">Latar Belakang</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(BACKGROUND_OPTIONS[activeCategory] || BACKGROUND_OPTIONS['fashion']).map((bg) => (
                                <button key={bg.id} onClick={() => setBgStyle(bg.id)} className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${bgStyle === bg.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                                    {bg.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider text-[10px]">Model Presenter</label>
                        <select value={modelType} onChange={(e) => setModelType(e.target.value as ModelType)} className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-500">
                            <option value="no-model">Tanpa Model</option>
                            <option value="hand-model">Dipegang Tangan</option>
                            <option value="indo">Model Asia / Indonesia</option>
                            <option value="bule">Model Western / Bule</option>
                            <option value="mannequin">Mannequin</option>
                        </select>
                        {(modelType !== 'no-model' && modelType !== 'hand-model') && (
                            <div className="mt-3 p-3 bg-white border border-slate-100 rounded-lg shadow-inner">
                                <div className="flex gap-2 mb-3">
                                    <button onClick={() => setGender('female')} className={`flex-1 py-1.5 text-xs font-bold rounded transition ${gender === 'female' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-400 border border-transparent'}`}>Wanita</button>
                                    <button onClick={() => setGender('male')} className={`flex-1 py-1.5 text-xs font-bold rounded transition ${gender === 'male' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-400 border border-transparent'}`}>Pria</button>
                                </div>
                                <div className="grid grid-cols-3 gap-1 mb-2">
                                    {['standard', 'casual', 'gen-z', 'formal', 'candid', 'cinematic'].map(p => (
                                        <button key={p} onClick={() => setPoseStyle(p as PoseStyle)} className={`py-1 text-[9px] font-bold rounded border uppercase ${poseStyle === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500'}`}>{p}</button>
                                    ))}
                                </div>
                                {gender === 'female' && (
                                    <button onClick={() => setUseHijab(!useHijab)} className="w-full flex items-center gap-2 text-[10px] text-slate-700 font-bold mt-2 p-2 bg-slate-50 rounded hover:bg-white transition border border-transparent hover:border-slate-200">
                                        {useHijab ? <CheckSquare className="w-4 h-4 text-indigo-600"/> : <Square className="w-4 h-4 text-slate-400"/>} Gunakan Hijab
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase text-[10px]">Jumlah Foto</label>
                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2">
                                <input type="range" min="1" max="4" value={imageCount} onChange={(e) => setImageCount(parseInt(e.target.value))} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                <span className="text-xs font-black text-indigo-600 min-w-[12px]">{imageCount}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase text-[10px]">Konteks Produk</label>
                            <input type="text" value={productContext} onChange={(e) => setProductContext(e.target.value)} placeholder="Contoh: Botol Kopi" className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-500" />
                        </div>
                    </div>
                </div>

                <div className="mt-auto pb-20 md:pb-4 space-y-3">
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-yellow-800">
                                <Coins className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Estimasi Biaya Studio</span>
                            </div>
                            <div className="flex flex-col items-end">
                                {currentCosts.free ? (
                                    <span className="text-xs font-black text-green-700 uppercase tracking-tighter">Gratis (Free Tier)</span>
                                ) : (
                                    <>
                                        <span className="text-xs font-black text-yellow-900">{currentCosts.tokens.toLocaleString()} Tokens</span>
                                        <span className="text-[10px] font-bold text-green-700">Rp {currentCosts.idr.toLocaleString()} (Est. PPN)</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-[9px] text-yellow-700 leading-tight border-t border-yellow-200 pt-2">
                            <Info className="w-3 h-3 shrink-0 mt-0.5" />
                            <p>Harga final ditentukan oleh Google Cloud Console. Gunakan <b>Free Tier</b> jika ingin mencoba gratis.</p>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg border border-red-100 flex gap-2 animate-in slide-in-from-bottom-2 shadow-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <button 
                        onClick={handleGenerate} 
                        disabled={!uploadedImage || isGenerating} 
                        className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-40 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin w-5 h-5"/> : <Sparkles className="w-4 h-4"/>}
                        {isGenerating ? (progressMsg || 'Memproses Studio...') : 'Mulai Photoshoot'}
                    </button>
                </div>
            </div>

            <div className={`flex-1 bg-slate-100 p-4 md:p-8 overflow-y-auto ${generatedMedia.length === 0 && !isGenerating ? 'hidden md:block' : 'block'}`}>
                <div className="max-w-5xl mx-auto h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Studio Gallery</h2>
                        {generatedMedia.length > 0 && (
                            <button onClick={() => setGeneratedMedia([])} className="md:hidden text-[10px] font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm uppercase tracking-wider">+ Buat Baru</button>
                        )}
                    </div>

                    {generatedMedia.length === 0 && !isGenerating ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 min-h-[400px]">
                            <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-bold text-sm tracking-widest uppercase opacity-40 text-center">Lakukan Photoshoot Untuk Melihat Hasil Studio</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
                            {isGenerating && (
                                <div className="aspect-square bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8 animate-pulse">
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin mb-4"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Menghubungi Server AI...</p>
                                    <p className="text-[9px] text-slate-400 mt-2 text-center">Ini mungkin memakan waktu 10-30 detik</p>
                                </div>
                            )}
                            {generatedMedia.map((media) => (
                                <div key={media.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">
                                    <img src={media.url} alt="Result" className="w-full h-auto object-contain bg-slate-50" />
                                    <div className="absolute top-4 right-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleDownload(media)} className="bg-white/90 text-indigo-600 p-3 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition flex items-center justify-center"><Download className="w-5 h-5" /></button>
                                    </div>
                                    <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                                        <div>
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{media.style}</span>
                                            <div className="text-[9px] text-slate-400 font-mono">ID-{media.id.toString().slice(-4)}</div>
                                        </div>
                                        <div className="bg-slate-50 px-2 py-1 rounded border text-[9px] font-bold text-slate-500 uppercase">{media.ratio}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
