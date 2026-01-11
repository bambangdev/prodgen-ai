import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Download, Settings, X, AlertCircle, Server, Layers, RefreshCw, User, Shirt, Utensils, Car, Leaf, LayoutGrid, Tag, FileText, Refrigerator, Pill, Monitor, BookOpen, Gamepad2, Baby, CheckSquare, Square, Smartphone, MonitorPlay, RectangleVertical, Play, Copy, Check, Camera, Coins, Zap } from 'lucide-react';

// --- Types ---
type CategoryType = 'fashion' | 'kids-fashion' | 'food' | 'kitchen' | 'beauty' | 'medicine' | 'herbal' | 'automotive' | 'electronics' | 'ebook' | 'toys';
type EngineType = 'gemini-nano' | 'huggingface';
type ModelType = 'no-model' | 'indo' | 'bule' | 'mannequin' | 'hand-model';
type GenderType = 'male' | 'female';
type PoseStyle = 'standard' | 'casual' | 'gen-z' | 'formal' | 'candid' | 'cinematic';
type AspectRatioType = '1:1' | '9:16' | '16:9' | '4:5' | '3:4';
type QualityMode = 'eco' | 'hd'; 

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

// --- Background Presets ---
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

// --- Helper: Kompres Gambar (Menghemat Credit/Token) ---
const compressImage = (base64Str: string, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
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
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Kompresi JPEG quality 0.8
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
    });
};

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

  // Logika Estimasi Biaya
  const calculateCost = () => {
      let baseCost = 1; 
      if (qualityMode === 'hd') baseCost = 2.5; // HD lebih mahal tokennya
      return Math.round(baseCost * imageCount);
  };

  const getImagePrompt = (category: CategoryType, style: string, model: ModelType, gen: GenderType, hijab: boolean, pose: PoseStyle, ratio: AspectRatioType, context: string) => {
    let baseInstruction = "Product replacement. ";
    let subject = context ? `Product: ${context}` : "Product";
    let strictness = "Keep product logo/shape EXACT.";
    let quality = "Photorealistic, 8k."; 
    
    let modelDesc = "";
    if (model !== 'no-model' && model !== 'hand-model') {
        let ethnicity = model === 'indo' ? "Indonesian" : model === 'bule' ? "Western" : "Mannequin";
        let genderStr = gen === 'male' ? "Male" : "Female";
        let hijabStr = (model === 'indo' && gen === 'female' && hijab) ? "wearing Hijab," : "";
        
        modelDesc = category === 'kids-fashion' 
            ? `Cute ${ethnicity} ${gen === 'male' ? 'boy' : 'girl'} ${hijabStr}` 
            : `Pro ${ethnicity} ${genderStr} model ${hijabStr}`;
    } else if (model === 'hand-model') {
        modelDesc = gen === 'male' ? "male hand" : "female hand";
    }

    let scene = "";
    switch (category) {
        case 'fashion':
        case 'kids-fashion':
            scene = (model !== 'no-model' && model !== 'hand-model') 
                ? `Worn by ${modelDesc}. Pose: ${pose}.` 
                : `Aesthetic placement.`;
            break;
        case 'food': scene = "Plated beautifully."; break;
        default: scene = "Professional placement."; break;
    }

    return `${baseInstruction} ${subject}. Scene: ${scene} Background: ${style}. Ratio: ${ratio}. ${strictness} ${quality}`;
  };

  const generateImageGemini = async (base64Image: string) => {
    try {
        const cleanBase64 = base64Image.split(',')[1];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiKey}`;
        const prompt = getImagePrompt(activeCategory, bgStyle, modelType, gender, useHijab, poseStyle, aspectRatio, productContext);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }] }],
                generationConfig: { responseModalities: ["IMAGE"], temperature: 0.4 }
            })
        });

        if (!response.ok) throw new Error((await response.json()).error?.message || "Gemini Error");
        const data = await response.json();
        const img = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        if (!img) throw new Error("No image returned");
        return `data:image/jpeg;base64,${img.inlineData.data}`;
    } catch (e) { throw e; }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) { setErrorMsg("Upload foto produk dulu."); return; }
    if (engine === 'gemini-nano' && !geminiKey) { setErrorMsg("Butuh Gemini Key."); setShowApiSettings(true); return; }
    if (engine === 'huggingface' && !hfToken) { setErrorMsg("Butuh HF Token."); setShowApiSettings(true); return; }

    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedMedia([]); 

    try {
        // Optimasi: Kompres sebelum kirim (Hemat Token)
        const targetWidth = qualityMode === 'eco' ? 512 : 1024;
        setProgressMsg(`Mengompres Foto (${qualityMode.toUpperCase()} Mode)...`);
        const optimizedImage = await compressImage(uploadedImage, targetWidth);

        for (let i = 0; i < imageCount; i++) {
            setProgressMsg(`Memproses Foto ${i + 1}/${imageCount}...`);
            let resultUrl = "";
            
            if (engine === 'gemini-nano') resultUrl = await generateImageGemini(optimizedImage);
            else {
                const MODEL_URL = "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix";
                const prompt = `Put this product (${productContext}) in a ${bgStyle} background.`;
                const response = await fetch(MODEL_URL, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${hfToken.trim()}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        inputs: optimizedImage,
                        parameters: { prompt, image_guidance_scale: 1.5, guidance_scale: 7.5 }
                    }),
                });
                if (!response.ok) throw new Error("HF Error");
                const blob = await response.blob();
                resultUrl = URL.createObjectURL(blob);
            }

            if (resultUrl) {
                setGeneratedMedia(prev => [
                    ...prev, 
                    { 
                        id: Date.now() + i, 
                        url: resultUrl, 
                        type: 'image',
                        style: bgStyle,
                        ratio: aspectRatio,
                        caption: enableCaption ? {...captionData} : undefined
                    }
                ]);
            }
        }
    } catch (err: any) {
        setErrorMsg(err.message || "Gagal generate.");
        setShowApiSettings(true);
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
          if (media.caption) {
               const scale = canvas.width / 1024;
               ctx.fillStyle = "white";
               ctx.fillRect(20*scale, canvas.height - 200*scale, canvas.width - 40*scale, 180*scale);
               ctx.fillStyle = "black";
               ctx.font = `bold ${40*scale}px sans-serif`;
               ctx.fillText(media.caption.title, 50*scale, canvas.height - 120*scale);
          }
          link.href = canvas.toDataURL('image/jpeg');
          link.click();
      };
  };

  const CategoryBtn = ({ id, icon: Icon, label }: { id: CategoryType, icon: any, label: string }) => (
    <button 
        onClick={() => { setActiveCategory(id); setBgStyle(BACKGROUND_OPTIONS[id] ? BACKGROUND_OPTIONS[id][0].id : 'studio'); }}
        className={`w-auto md:w-full flex-shrink-0 flex flex-col items-center justify-center py-3 px-1 gap-1 transition-all border-b-4 md:border-b-0 md:border-l-4 ${activeCategory === id ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        style={{ minWidth: '70px' }}
    >
        <Icon className={`w-5 h-5 ${activeCategory === id ? 'stroke-[2.5px]' : ''}`} />
        <span className="text-[10px] font-bold text-center leading-tight whitespace-nowrap md:whitespace-normal">{label}</span>
    </button>
  );

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
                  <p className="text-[10px] text-slate-400 font-medium">AI Product Photoshoot</p>
              </div>
            </div>
            <button 
                onClick={() => setShowApiSettings(!showApiSettings)}
                className={`p-2 rounded-lg border flex items-center gap-2 text-xs font-bold transition ${showApiSettings ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}
            >
                <Server className="w-4 h-4" /> <span className="hidden md:inline">Server</span>
            </button>
      </nav>

      {/* Content */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-full md:w-20 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-row md:flex-col py-2 md:py-4 gap-1 shrink-0 overflow-x-auto md:overflow-y-auto hide-scrollbar z-40 shadow-sm">
               <CategoryBtn id="fashion" icon={Shirt} label="Fashion" />
               <CategoryBtn id="kids-fashion" icon={Baby} label="Anak" />
               <CategoryBtn id="food" icon={Utensils} label="Makanan" />
               <CategoryBtn id="kitchen" icon={Refrigerator} label="Dapur" />
               <CategoryBtn id="beauty" icon={Sparkles} label="Skincare" />
               <CategoryBtn id="medicine" icon={Pill} label="Obat" />
               <CategoryBtn id="herbal" icon={Leaf} label="Herbal" />
               <CategoryBtn id="automotive" icon={Car} label="Otomotif" />
               <CategoryBtn id="electronics" icon={Monitor} label="Gadget" />
               <CategoryBtn id="ebook" icon={BookOpen} label="E-Book" />
               <CategoryBtn id="toys" icon={Gamepad2} label="Mainan" />
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Panel Config */}
            <div className={`
                absolute md:static inset-0 z-30 bg-slate-50 md:block
                w-full md:w-[380px] border-r border-slate-200 flex flex-col overflow-y-auto p-4 md:p-6 gap-6
                ${generatedMedia.length > 0 && !isGenerating ? 'hidden md:flex' : 'flex'} 
            `}>
                
                {showApiSettings && (
                    <div className="bg-white border border-indigo-100 p-4 rounded-xl shadow-sm animate-in slide-in-from-top-2 border-l-4 border-l-indigo-600">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-xs uppercase text-slate-400 flex items-center gap-2"><Server className="w-3 h-3"/> Server Configuration</h3>
                        </div>
                        <div className="mb-4">
                            <label className="text-[10px] font-bold text-slate-500 mb-1 block">Engine</label>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                <button onClick={() => setEngine('gemini-nano')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${engine === 'gemini-nano' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Gemini</button>
                                <button onClick={() => setEngine('huggingface')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${engine === 'huggingface' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>HuggingFace</button>
                            </div>
                        </div>
                        <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="Gemini Key" className="w-full text-xs p-2 border rounded-lg bg-slate-50 mb-2"/>
                        <input type="password" value={hfToken} onChange={(e) => setHfToken(e.target.value)} placeholder="HF Token" className="w-full text-xs p-2 border rounded-lg bg-slate-50"/>
                    </div>
                )}

                <div>
                    <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Upload className="w-4 h-4"/> 1. Upload Produk</h2>
                    {!uploadedImage ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-white transition cursor-pointer relative bg-slate-100/50">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="bg-white p-3 rounded-full shadow-sm w-fit mx-auto mb-2"><ImageIcon className="w-6 h-6 text-indigo-500" /></div>
                            <p className="text-xs font-medium text-slate-500">Klik untuk upload foto</p>
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-sm">
                            <img src={uploadedImage} alt="Uploaded" className="w-full h-48 object-contain bg-slate-100" />
                            <button onClick={() => {setUploadedImage(null); setGeneratedMedia([])}} className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:text-red-500 transition"><X className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>

                {/* Hemat Credit Mode */}
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                     <h2 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500"/> Hemat Credit
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={() => setQualityMode('eco')} className={`flex-1 flex flex-col items-center p-2 rounded-lg border transition ${qualityMode === 'eco' ? 'bg-white border-green-500 shadow-sm ring-1 ring-green-500' : 'bg-transparent border-indigo-200 text-slate-500'}`}>
                            <span className="text-[10px] font-bold text-green-600">ECO Mode</span>
                            <span className="text-[9px]">Hemat (512px)</span>
                        </button>
                        <button onClick={() => setQualityMode('hd')} className={`flex-1 flex flex-col items-center p-2 rounded-lg border transition ${qualityMode === 'hd' ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600' : 'bg-transparent border-indigo-200 text-slate-500'}`}>
                            <span className="text-[10px] font-bold text-indigo-600">HD Mode</span>
                            <span className="text-[9px]">Jelas (1024px)</span>
                        </button>
                    </div>
                </div>

                <div>
                     <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/> 2. Info Produk</h2>
                     <input type="text" value={productContext} onChange={(e) => setProductContext(e.target.value)} placeholder="Contoh: Kripik Singkong" className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-500 transition" />
                </div>

                <div>
                    <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Settings className="w-4 h-4"/> 3. Konfigurasi</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Background</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(BACKGROUND_OPTIONS[activeCategory] || BACKGROUND_OPTIONS['fashion']).map((bg) => (
                                    <button key={bg.id} onClick={() => setBgStyle(bg.id)} className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${bgStyle === bg.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                                        {bg.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Model Presenter</label>
                            <select value={modelType} onChange={(e) => setModelType(e.target.value as ModelType)} className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white">
                                <option value="no-model">Tanpa Model</option>
                                <option value="hand-model">Dipegang Tangan</option>
                                <option value="indo">Model Indonesia</option>
                                <option value="bule">Model Western</option>
                                <option value="mannequin">Mannequin</option>
                            </select>
                            {(modelType !== 'no-model' && modelType !== 'hand-model') && (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {['standard', 'casual', 'gen-z', 'formal', 'candid', 'cinematic'].map(p => (
                                        <button key={p} onClick={() => setPoseStyle(p as PoseStyle)} className={`py-1 text-[10px] rounded border ${poseStyle === p ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white'}`}>{p}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 flex justify-between">
                                <span>Jumlah Foto</span>
                                <span className="text-indigo-600">{imageCount}</span>
                            </label>
                            <input type="range" min="1" max="4" value={imageCount} onChange={(e) => setImageCount(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="mt-auto pb-20 md:pb-4">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Estimasi Token</span>
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200 shadow-sm">
                            <Coins className="w-3 h-3" />
                            <span className="text-[10px] font-bold">~{calculateCost()} Units</span>
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={!uploadedImage || isGenerating} className="w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50">
                        {isGenerating ? <RefreshCw className="animate-spin w-5 h-5"/> : <Sparkles className="w-5 h-5"/>}
                        {isGenerating ? (progressMsg || 'Processing...') : 'Generate Photo'}
                    </button>
                </div>
            </div>

            <div className={`flex-1 bg-slate-100 p-4 md:p-8 overflow-y-auto ${generatedMedia.length === 0 && !isGenerating ? 'hidden md:block' : 'block'}`}>
                <div className="max-w-5xl mx-auto h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Hasil Generation</h2>
                        <button onClick={() => setGeneratedMedia([])} className="md:hidden text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100">+ Buat Baru</button>
                    </div>
                    {generatedMedia.length === 0 && !isGenerating ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-200/50 min-h-[300px]">
                            <LayoutGrid className="w-16 h-16 mb-4 text-slate-300" />
                            <p className="font-medium">Area Hasil</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
                            {isGenerating && (
                                <div className="aspect-square bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8 animate-pulse">
                                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin mb-4"></div>
                                    <p className="text-sm font-bold text-slate-700">Sedang Memproses...</p>
                                </div>
                            )}
                            {generatedMedia.map((media) => (
                                <div key={media.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                                    <img src={media.url} alt="Result" className="w-full h-auto object-contain bg-slate-50" />
                                    <div className="absolute top-4 right-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDownload(media)} className="bg-white text-indigo-600 p-2.5 rounded-full shadow-lg"><Download className="w-5 h-5" /></button>
                                    </div>
                                    <div className="p-3 bg-white border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-600 capitalize">{media.style.replace('-', ' ')}</span>
                                        <span className="text-[10px] text-slate-400">ID: {media.id.toString().slice(-4)}</span>
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
