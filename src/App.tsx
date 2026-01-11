import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Download, Settings, X, AlertCircle, Server, Layers, RefreshCw, User, Shirt, Utensils, Car, Leaf, LayoutGrid, Tag, FileText, Refrigerator, Pill, Monitor, BookOpen, Gamepad2, Baby, CheckSquare, Square, Smartphone, MonitorPlay, RectangleVertical, Play, Copy, Check, Camera } from 'lucide-react';

// --- Types ---
type CategoryType = 'fashion' | 'kids-fashion' | 'food' | 'kitchen' | 'beauty' | 'medicine' | 'herbal' | 'automotive' | 'electronics' | 'ebook' | 'toys';
type EngineType = 'gemini-nano' | 'huggingface';
type ModelType = 'no-model' | 'indo' | 'bule' | 'mannequin' | 'hand-model';
type GenderType = 'male' | 'female';
type PoseStyle = 'standard' | 'casual' | 'gen-z' | 'formal' | 'candid' | 'cinematic';
type AspectRatioType = '1:1' | '9:16' | '16:9' | '4:5' | '3:4';

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

// --- Constants: Background Presets ---
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
        {id: 'wooden-table', label: 'Wooden Table'},
        {id: 'marble-top', label: 'Marble Counter'},
        {id: 'picnic', label: 'Outdoor Picnic'},
        {id: 'restaurant', label: 'Fine Dining'},
        {id: 'kitchen', label: 'Modern Kitchen'},
        {id: 'dark-moody', label: 'Dark Moody'}
    ],
    kitchen: [
        {id: 'modern-kitchen', label: 'Modern Kitchen'},
        {id: 'rustic-kitchen', label: 'Rustic Kitchen'},
        {id: 'chef-table', label: 'Chef Table'},
        {id: 'dining-room', label: 'Dining Room'},
        {id: 'sink-area', label: 'Clean Sink Area'},
        {id: 'pantry', label: 'Pantry Shelf'}
    ],
    beauty: [
        {id: 'water-splash', label: 'Water Splash'},
        {id: 'vanity', label: 'Vanity Mirror'},
        {id: 'silk-sheets', label: 'Silk Texture'},
        {id: 'bathroom', label: 'Luxury Bathroom'},
        {id: 'pastel-podium', label: 'Pastel Podium'},
        {id: 'flowers', label: 'Floral Arrangement'}
    ],
    medicine: [
        {id: 'pharmacy', label: 'Pharmacy Shelf'},
        {id: 'lab', label: 'White Lab'},
        {id: 'medical-table', label: 'Medical Table'},
        {id: 'clean-white', label: 'Sterile White'},
        {id: 'cabinet', label: 'Medicine Cabinet'},
        {id: 'hospital', label: 'Hospital Setting'}
    ],
    automotive: [
        {id: 'garage', label: 'Modern Garage'},
        {id: 'highway', label: 'Highway Speed'},
        {id: 'showroom', label: 'Luxury Showroom'},
        {id: 'mountain-road', label: 'Mountain Road'},
        {id: 'city-night', label: 'City Night Neon'},
        {id: 'desert', label: 'Open Desert'}
    ],
    electronics: [
        {id: 'gaming-setup', label: 'Gaming Setup'},
        {id: 'office-desk', label: 'Office Desk'},
        {id: 'minimalist-tech', label: 'Minimalist Tech'},
        {id: 'cyberpunk', label: 'Cyberpunk Neon'},
        {id: 'living-room', label: 'Living Room TV'},
        {id: 'studio-dark', label: 'Dark Tech Studio'}
    ],
    herbal: [
        {id: 'leaves', label: 'Green Leaves'},
        {id: 'sunlight', label: 'Morning Sunlight'},
        {id: 'wooden-board', label: 'Rustic Wood'},
        {id: 'forest', label: 'Deep Forest'},
        {id: 'zen-stone', label: 'Zen Stones'},
        {id: 'kitchen-window', label: 'Kitchen Window'}
    ],
    ebook: [
        {id: 'reading-nook', label: 'Cozy Nook'},
        {id: 'wooden-desk', label: 'Wooden Desk'},
        {id: 'library', label: 'Library Shelf'},
        {id: 'tablet-mockup', label: 'Tablet Display'},
        {id: 'coffee-shop', label: 'Coffee Shop'},
        {id: 'bed-side', label: 'Bed Side'}
    ],
    toys: [
        {id: 'playroom', label: 'Playroom Floor'},
        {id: 'grass', label: 'Green Grass'},
        {id: 'abstract-color', label: 'Abstract Color'},
        {id: 'preschool', label: 'Preschool'},
        {id: 'shelf', label: 'Toy Shelf'},
        {id: 'sandpit', label: 'Sandpit'}
    ]
};

// --- Main Component ---
export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Core Settings
  const [activeCategory, setActiveCategory] = useState<CategoryType>('fashion');
  const [bgStyle, setBgStyle] = useState<string>('studio');
  const [modelType, setModelType] = useState<ModelType>('no-model');
  const [gender, setGender] = useState<GenderType>('female'); 
  const [useHijab, setUseHijab] = useState(false); 
  const [poseStyle, setPoseStyle] = useState<PoseStyle>('standard');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [imageCount, setImageCount] = useState<number>(1);
  const [engine, setEngine] = useState<EngineType>('gemini-nano');
  
  // New Configs: Context & Caption
  const [productContext, setProductContext] = useState('');
  const [enableCaption, setEnableCaption] = useState(false);
  const [captionData, setCaptionData] = useState<CaptionData>({ title: '', desc: '', price: '' });

  // Keys
  const [hfToken, setHfToken] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle File Upload
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

  // --- PROMPT CONSTRUCTORS ---

  // 1. Image Prompt (IMPROVED HIJAB & MODEL LOGIC)
  const getImagePrompt = (category: CategoryType, style: string, model: ModelType, gen: GenderType, hijab: boolean, pose: PoseStyle, ratio: AspectRatioType, context: string) => {
    let baseInstruction = "Edit this image. Replace the background and if a model is requested, display the product being worn/held by the model. ";
    let subject = context ? `the product (${context})` : "the product";
    let visualStrictness = "Do NOT change the product logo/text/shape. Keep the product EXACTLY as it is. ";
    let quality = "High quality, photorealistic, 8k, highly detailed. ";
    let composition = `Composition aspect ratio target: ${ratio}. `;
    
    // Model Description - IMPROVED LOGIC
    let modelDesc = "";
    if (model !== 'no-model' && model !== 'hand-model') {
        let ethnicity = "";
        if (model === 'indo') ethnicity = "Indonesian (Asian features)";
        else if (model === 'bule') ethnicity = "Caucasian/Western";
        else if (model === 'mannequin') ethnicity = "Mannequin";

        let genderStr = gen === 'male' ? "Male" : "Female";
        
        // Hijab Logic
        let hijabStr = "";
        if (model === 'indo' && gen === 'female' && hijab) {
            hijabStr = "wearing a stylish modern Hijab headscarf covering the head, muslim fashion, polite clothing,";
        }

        if (category === 'kids-fashion') {
            modelDesc = `a cute ${ethnicity} little ${gen === 'male' ? 'boy' : 'girl'} ${hijabStr}`;
        } else {
            modelDesc = `a professional ${ethnicity} ${genderStr} model ${hijabStr}`;
        }
    } else if (model === 'hand-model') {
        modelDesc = gen === 'male' ? "a male hand" : "a female hand";
    }

    // Category Logic
    let interaction = "";
    let atmosphere = "";
    
    switch (category) {
        case 'fashion':
        case 'kids-fashion':
            if (model !== 'no-model' && model !== 'hand-model') {
                // Incorporate Pose here
                interaction = `worn by ${modelDesc}. The model is WEARING ${subject}. Fit the product naturally on the model's body. Pose: ${pose} style.`;
            } else {
                interaction = `Show ${subject} placed aesthetically.`;
            }
            atmosphere = `Fashion photography, trendy look. Background: ${style}.`;
            break;
        case 'food':
            interaction = "Plated beautifully, appetizing presentation.";
            atmosphere = `Professional food photography, delicious. Background: ${style}.`;
            break;
        case 'kitchen':
            interaction = "Placed on a surface.";
            atmosphere = `Kitchenware photography, bright, clean, functional atmosphere. Background: ${style}.`;
            break;
        case 'beauty':
            interaction = "Placed elegantly on a podium or surface.";
            atmosphere = `Cosmetic photography, soft lighting, glowing skin, luxury vibe. Background: ${style}.`;
            break;
        case 'medicine':
            interaction = "Placed in a sterile setting.";
            atmosphere = `Medical photography, trustworthy, clean, sterile, bright white lighting. Background: ${style}.`;
            break;
        case 'herbal':
            interaction = "Surrounded by natural ingredients (leaves, herbs).";
            atmosphere = `Wellness photography, organic, natural light, fresh, healthy. Background: ${style}.`;
            break;
        case 'automotive':
            interaction = "Parked in a cinematic angle.";
            atmosphere = `Automotive photography, dramatic lighting, reflections, metallic shine. Background: ${style}.`;
            break;
        case 'electronics':
            interaction = "Set up and ready to use.";
            atmosphere = `Tech photography, futuristic, neon or clean minimalist, high tech vibe. Background: ${style}.`;
            break;
        case 'ebook':
            interaction = "Displayed clearly.";
            atmosphere = `Lifestyle photography, cozy, intelligent, focus on reading experience. Background: ${style}.`;
            break;
        case 'toys':
            interaction = "Placed in a fun way.";
            atmosphere = `Toy photography, playful, colorful, vibrant, dynamic lighting. Background: ${style}.`;
            break;
        default:
            interaction = "Presented professionally.";
            atmosphere = `Product photography. Background: ${style}.`;
            break;
    }

    return `${baseInstruction} Show ${subject} ${interaction} ${atmosphere} ${composition} ${visualStrictness} ${quality}`;
  };

  // --- API HANDLERS ---

  // 1. Generate Image (Gemini)
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

  // 2. Generate Image (HF)
  const generateImageHF = async (base64Image: string) => {
      const MODEL_URL = "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix";
      const prompt = `Put this product (${productContext}) in a ${bgStyle} background.`;
      
      const response = await fetch(MODEL_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${hfToken.trim()}`, "Content-Type": "application/json" },
          body: JSON.stringify({
              inputs: base64Image,
              parameters: { prompt, image_guidance_scale: 1.5, guidance_scale: 7.5 }
          }),
      });
      if (!response.ok) throw new Error("HF Error: Check Token or Network");
      const blob = await response.blob();
      return URL.createObjectURL(blob);
  };

  // --- MAIN HANDLER ---
  const handleGenerate = async () => {
    if (!uploadedImage) { setErrorMsg("Upload foto produk dulu."); return; }
    
    // Strict Key Checks
    if (engine === 'gemini-nano' && !geminiKey) { setErrorMsg("Butuh Gemini Key."); setShowApiSettings(true); return; }
    if (engine === 'huggingface' && !hfToken) { setErrorMsg("Butuh HF Token."); setShowApiSettings(true); return; }

    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedMedia([]); 

    try {
        // IMAGE GEN LOGIC (Loop for Image Count)
        for (let i = 0; i < imageCount; i++) {
            setProgressMsg(`Generating Image ${i + 1}/${imageCount}...`);
            let resultUrl = "";
            if (engine === 'gemini-nano') resultUrl = await generateImageGemini(uploadedImage);
            else resultUrl = await generateImageHF(uploadedImage);

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
        let msg = err.message || "Gagal generate.";
        if (msg.includes("Failed to fetch")) msg = "Koneksi Gagal. Cek internet atau Token HF Anda.";
        setErrorMsg(msg);
        if (msg.includes("HF") || msg.includes("Gemini")) {
            setShowApiSettings(true);
        }
    } finally {
        setIsGenerating(false);
        setProgressMsg('');
    }
  };

  // --- DOWNLOAD ---
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
        style={{ minWidth: '70px' }} // Min width for mobile scroll
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
                  <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none">Infinica <span className="text-indigo-600">Pro</span></h1>
                  <p className="text-[10px] text-slate-400 font-medium">AI Product by Calica</p>
              </div>
            </div>
            <button 
                onClick={() => setShowApiSettings(!showApiSettings)}
                className={`p-2 rounded-lg border flex items-center gap-2 text-xs font-bold transition ${showApiSettings ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}
            >
                <Server className="w-4 h-4" /> <span className="hidden md:inline">Server</span>
            </button>
      </nav>

      {/* Main Content: Flex Col on Mobile, Row on Desktop */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          
          {/* SIDEBAR: Horizontal on Mobile, Vertical on Desktop */}
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

          {/* MAIN WORKSPACE */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            
            {/* CONFIG PANEL: Full width on mobile, Fixed width on desktop */}
            <div className={`
                absolute md:static inset-0 z-30 bg-slate-50 md:block
                w-full md:w-[380px] border-r border-slate-200 flex flex-col overflow-y-auto p-4 md:p-6 gap-6
                ${generatedMedia.length > 0 && !isGenerating ? 'hidden md:flex' : 'flex'} 
                /* Logic: Hide config on mobile if we have results, unless generating */
            `}>
                
                {/* Server Settings */}
                {showApiSettings && (
                    <div className="bg-white border border-indigo-100 p-4 rounded-xl shadow-sm animate-in slide-in-from-top-2 border-l-4 border-l-indigo-600">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-xs uppercase text-slate-400 flex items-center gap-2"><Server className="w-3 h-3"/> Server Configuration</h3>
                        </div>
                        
                        <div className="mb-4">
                            <label className="text-[10px] font-bold text-slate-500 mb-1 block">Generation Engine</label>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                <button onClick={() => setEngine('gemini-nano')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${engine === 'gemini-nano' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Gemini</button>
                                <button onClick={() => setEngine('huggingface')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition ${engine === 'huggingface' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>HuggingFace</button>
                            </div>
                        </div>

                        {engine === 'gemini-nano' && (
                            <div className="mb-3">
                                <label className="text-[10px] font-bold text-slate-500 mb-1 block">Google API Key</label>
                                <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="w-full text-xs p-2 border rounded-lg bg-slate-50"/>
                            </div>
                        )}

                        {engine === 'huggingface' && (
                             <div className="mb-3">
                                <label className="text-[10px] font-bold text-slate-500 mb-1 block">Hugging Face Token</label>
                                <input type="password" value={hfToken} onChange={(e) => setHfToken(e.target.value)} placeholder="hf_..." className="w-full text-xs p-2 border rounded-lg bg-slate-50"/>
                             </div>
                        )}
                        
                        {errorMsg && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-[10px] text-red-600 font-medium flex flex-col gap-2">
                                <div className="font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Error:</div>
                                <div>{errorMsg}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Upload */}
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

                {/* Info */}
                <div>
                     <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4"/> 2. Info Produk
                    </h2>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                        <input 
                            type="text"
                            value={productContext}
                            onChange={(e) => setProductContext(e.target.value)}
                            placeholder="Context (e.g., Spicy Chips)"
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500 transition"
                        />
                        
                        <div className="pt-2 border-t border-slate-100">
                             <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                    <Tag className="w-3 h-3 text-indigo-500" /> Teks Promo
                                </label>
                                <button 
                                    onClick={() => setEnableCaption(!enableCaption)}
                                    className={`relative w-9 h-5 rounded-full transition-colors ${enableCaption ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${enableCaption ? 'translate-x-4' : ''}`} />
                                </button>
                             </div>
                             {enableCaption && (
                                 <div className="space-y-2 animate-in slide-in-from-top-2">
                                     <input type="text" placeholder="Judul" value={captionData.title} onChange={e => setCaptionData({...captionData, title: e.target.value})} className="w-full text-xs p-2 rounded border border-slate-200" />
                                     <input type="text" placeholder="Deskripsi" value={captionData.desc} onChange={e => setCaptionData({...captionData, desc: e.target.value})} className="w-full text-xs p-2 rounded border border-slate-200" />
                                     <input type="text" placeholder="Harga" value={captionData.price} onChange={e => setCaptionData({...captionData, price: e.target.value})} className="w-full text-xs p-2 rounded border border-slate-200" />
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Config */}
                <div>
                    <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Settings className="w-4 h-4"/> 3. Konfigurasi Visual
                    </h2>

                    <div className="space-y-4">
                        {/* Background */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Lokasi / Background</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(BACKGROUND_OPTIONS[activeCategory] || BACKGROUND_OPTIONS['fashion']).map((bg) => (
                                    <button 
                                        key={bg.id}
                                        onClick={() => setBgStyle(bg.id)}
                                        className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${bgStyle === bg.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                                    >
                                        {bg.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Model & Gender */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Model Presenter</label>
                            <select 
                                value={modelType}
                                onChange={(e) => setModelType(e.target.value as ModelType)}
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-500"
                            >
                                <option value="no-model">Tanpa Model (Produk Saja)</option>
                                <option value="hand-model">Dipegang Tangan</option>
                                <option value="indo">Model Indonesia</option>
                                <option value="bule">Model Western</option>
                                <option value="mannequin">Mannequin</option>
                            </select>
                            
                            {modelType !== 'no-model' && (
                                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="flex gap-2 mb-2">
                                        <button onClick={() => setGender('female')} className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1 ${gender === 'female' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-white text-slate-500 border'}`}>
                                            <User className="w-3 h-3" /> Female
                                        </button>
                                        <button onClick={() => setGender('male')} className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1 ${gender === 'male' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-white text-slate-500 border'}`}>
                                            <User className="w-3 h-3" /> Male
                                        </button>
                                    </div>
                                    {/* HIJAB LOGIC FIXED */}
                                    {modelType === 'indo' && gender === 'female' && (
                                        <button onClick={() => setUseHijab(!useHijab)} className="w-full flex items-center gap-2 text-xs text-slate-700 font-medium mt-1 p-1 hover:bg-white rounded transition">
                                            {useHijab ? <CheckSquare className="w-4 h-4 text-indigo-600"/> : <Square className="w-4 h-4 text-slate-400"/>} 
                                            {activeCategory === 'kids-fashion' ? "Hijab Anak" : "Pakai Hijab"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* POSE CONFIGURATION - RESTORED & WORKING */}
                        {(modelType !== 'no-model' && modelType !== 'hand-model') && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-2">
                                    <Camera className="w-3 h-3"/> Gaya Pose
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'standard', label: 'Standard' },
                                        { id: 'casual', label: 'Casual' },
                                        { id: 'gen-z', label: 'Gen-Z' },
                                        { id: 'formal', label: 'Formal' },
                                        { id: 'candid', label: 'Candid' },
                                        { id: 'cinematic', label: 'Cinema' }
                                    ].map((pose) => (
                                        <button
                                            key={pose.id}
                                            onClick={() => setPoseStyle(pose.id as PoseStyle)}
                                            className={`py-1.5 px-1 text-[10px] rounded-lg border transition-all text-center ${
                                                poseStyle === pose.id 
                                                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-bold' 
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                                            }`}
                                        >
                                            {pose.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Image Count */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 flex justify-between">
                                <span>Jumlah Foto</span>
                                <span className="text-indigo-600">{imageCount}</span>
                            </label>
                            <input 
                                type="range" 
                                min="1" 
                                max="4" 
                                value={imageCount} 
                                onChange={(e) => setImageCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>1</span><span>4</span>
                            </div>
                        </div>

                        {/* Ratio */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Rasio (Auto Crop)</label>
                            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                                {[
                                    { r: '1:1', icon: Square },
                                    { r: '9:16', icon: Smartphone },
                                    { r: '16:9', icon: MonitorPlay },
                                    { r: '4:5', icon: RectangleVertical }
                                ].map((ratio) => (
                                    <button 
                                        key={ratio.r}
                                        onClick={() => setAspectRatio(ratio.r as AspectRatioType)}
                                        className={`flex-1 py-1.5 rounded-md flex flex-col items-center gap-1 transition-all ${aspectRatio === ratio.r ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        <ratio.icon className="w-3.5 h-3.5" />
                                        <span className="text-[9px]">{ratio.r}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="mt-auto pb-20 md:pb-4">
                    {errorMsg && !showApiSettings && (
                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span className="leading-tight">{errorMsg}</span>
                        </div>
                    )}
                    <button 
                        onClick={handleGenerate}
                        disabled={!uploadedImage || isGenerating}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600`}
                    >
                        {isGenerating ? <RefreshCw className="animate-spin w-5 h-5"/> : <Sparkles className="w-5 h-5"/>}
                        {isGenerating ? (progressMsg || 'Processing...') : 'Generate Photo'}
                    </button>
                </div>
            </div>

            {/* RESULTS */}
            <div className={`
                flex-1 bg-slate-100 p-4 md:p-8 overflow-y-auto
                ${generatedMedia.length === 0 && !isGenerating ? 'hidden md:block' : 'block'}
                /* On mobile: Show results only if they exist or generating. On desktop: always show */
            `}>
                <div className="max-w-5xl mx-auto h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Hasil Generation</h2>
                        {/* Mobile Back Button to Config */}
                        <button 
                            onClick={() => setGeneratedMedia([])} 
                            className="md:hidden text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm"
                        >
                            + Buat Baru
                        </button>
                    </div>

                    {generatedMedia.length === 0 && !isGenerating ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-200/50 min-h-[300px]">
                            <LayoutGrid className="w-16 h-16 mb-4 text-slate-300" />
                            <p className="font-medium">Area Hasil</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 pb-24 md:pb-20">
                            {isGenerating && (
                                <div className="aspect-square bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8 animate-pulse">
                                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin mb-4"></div>
                                    <p className="text-sm font-bold text-slate-700">Creating Image...</p>
                                </div>
                            )}

                            {generatedMedia.map((media) => (
                                <div key={media.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all">
                                    
                                    <div className="relative">
                                        <img src={media.url} alt="Result" className="w-full h-auto object-contain bg-slate-50" />
                                        {media.caption && (
                                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-white/50">
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight">{media.caption.title}</h3>
                                                <p className="text-xs text-slate-500 mt-1">{media.caption.desc}</p>
                                                <div className="mt-2 font-bold text-indigo-600 text-base">{media.caption.price}</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute top-4 right-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleDownload(media)}
                                            className="bg-white text-indigo-600 p-2.5 rounded-full hover:scale-110 transition shadow-lg flex items-center justify-center"
                                            title="Download"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
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
