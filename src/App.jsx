import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Aperture, Clapperboard, Film, FileText, LayoutDashboard, Users, Layers,
  Settings, Plus, Search, ChevronRight, Sparkles, Copy, Download, Trash2,
  Save, Menu, X, Play, Clock3, Camera, Mic2, Video, WandSparkles, Check,
  ArrowUpRight, FolderOpen, PanelLeftClose, CircleHelp, Link2, RefreshCw
} from "lucide-react";

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = envUrl && envKey ? createClient(envUrl, envKey) : null;
const STORE = "ai-studio-projects-v1";

const seed = [{
  id: "demo-1",
  title: "ภารกิจหนีเที่ยว",
  type: "ซีรีส์การ์ตูน",
  genre: "ผจญภัย / คอมเมดี้",
  style: "การ์ตูน 3D น่ารัก แสงอบอุ่น",
  language: "ภาษาไทย",
  format: "9:16",
  description: "แมวสามตัววางแผนออกสำรวจบ้านอย่างลับ ๆ ก่อนจะหนีไปเที่ยวข้างนอก",
  characters: [
    { id: "c1", name: "นับหนึ่ง", role: "ตัวเอก", look: "แมวตามภาพอ้างอิง", outfit: "เสื้อฮู้ดสีฟ้า", voice: "เสียงไทยสดใส มั่นใจ", notes: "ขนาดตัวคงที่ทุกฉาก" },
    { id: "c2", name: "ปลาวาฬ", role: "ตัวละครหลัก", look: "แมวตัวเล็กตามภาพอ้างอิง", outfit: "เอี๊ยมสีเหลือง", voice: "เสียงไทยนุ่มน่ารัก", notes: "ขนาดตัวคงที่ทุกฉาก" },
    { id: "c3", name: "สไปร์ท", role: "ตัวละครหลัก", look: "แมวตามภาพอ้างอิง", outfit: "เสื้อสีแดง", voice: "เสียงไทยกวน ๆ", notes: "ล็อกลักษณะและเสื้อผ้า" }
  ],
  episodes: [{
    id: "e1", title: "ตอนที่ 1: แผนลับในห้องแมว", scenes: [
      { id: "s1", title: "ประชุมลับ", duration: 8, location: "ห้องเลี้ยงแมว", action: "แมวทั้งสามนั่งล้อมวงกระซิบกระซาบ วางแผนสำรวจบ้าน", dialogue: "นับหนึ่ง: คืนนี้เราจะเริ่มภารกิจสำรวจบ้าน!\\nปลาวาฬ: แล้วถ้าแม่จับได้ล่ะ?\\nสไปร์ท: ก็ทำหน้าเหมือนไม่มีอะไรเกิดขึ้นไง", camera: "เริ่มภาพกว้าง แล้วตัดสลับภาพใกล้สีหน้า", sfx: "เสียงกระซิบเบา ๆ และเสียงตลกตอนสไปร์ทพูด", prompt: "" }
    ]
  }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}];

const uid = () => Math.random().toString(36).slice(2, 10);
const clone = (x) => JSON.parse(JSON.stringify(x));
const pick = (items) => items[Math.floor(Math.random() * items.length)];

function randomSynopsis(project) {
  const title = project.title || "การผจญภัยครั้งใหม่";
  const genre = (project.genre || "ผจญภัย").toLowerCase();
  const cast = (project.characters || []).map(c => c.name).filter(Boolean);
  const leads = cast.length ? cast.slice(0, 3).join(" ตัวละคร ") : "กลุ่มตัวละครหลัก";
  const setups = genre.includes("สยอง") || genre.includes("ระทึก")
    ? ["เมื่อพบเสียงประหลาดจากสถานที่ต้องห้าม", "หลังได้รับข้อความปริศนาในคืนฝนตก", "เมื่อเหตุการณ์ที่อธิบายไม่ได้เริ่มเกิดขึ้น"]
    : genre.includes("คอม") || genre.includes("ตลก")
    ? ["เมื่อแผนง่าย ๆ กลับผิดพลาดไม่เป็นท่า", "หลังเกิดความเข้าใจผิดครั้งใหญ่", "เมื่อทุกคนต้องร่วมมือกันแก้ปัญหาสุดป่วน"]
    : genre.includes("แฟนตาซี")
    ? ["เมื่อค้นพบวัตถุลึกลับที่มีพลังพิเศษ", "หลังประตูสู่โลกอีกใบเปิดออก", "เมื่อคำทำนายเก่ากลับกลายเป็นเรื่องจริง"]
    : genre.includes("โรแมน") || genre.includes("ดราม่า")
    ? ["เมื่อความลับในอดีตถูกเปิดเผย", "หลังการพบกันโดยไม่คาดคิด", "เมื่อการตัดสินใจครั้งสำคัญเปลี่ยนความสัมพันธ์ของทุกคน"]
    : ["เมื่อแผนการสำคัญเริ่มต้นขึ้น", "หลังพบเบาะแสที่ไม่มีใครคาดคิด", "เมื่อเหตุการณ์ไม่คาดฝันทำให้ทุกคนต้องร่วมมือกัน"];
  const goals = ["พวกเขาต้องตามหาเบาะแสและฝ่าด่านทดสอบทีละขั้น", "ทุกการตัดสินใจนำไปสู่ความท้าทายใหม่และความจริงที่ซ่อนอยู่", "พวกเขาต้องใช้ไหวพริบ ความกล้า และความไว้ใจกันเพื่อไปให้ถึงเป้าหมาย"];
  const turns = ["แต่ยิ่งเข้าใกล้คำตอบ ก็ยิ่งพบว่ามีบางอย่างไม่เป็นอย่างที่คิด", "ทว่ามีอุปสรรคหนึ่งที่ทำให้แผนทั้งหมดเปลี่ยนไป", "และก่อนจะสำเร็จ พวกเขาต้องเผชิญบททดสอบที่คาดไม่ถึง"];
  return `${title} เล่าเรื่องของ${leads} ${pick(setups)} ${pick(goals)} ${pick(turns)} โดยแต่ละตอนจะเปิดเผยเบาะแสใหม่และพาเรื่องราวเดินหน้าต่อเนื่อง`;
}

function buildSceneDraft(project, episodeTitle, sceneNumber, previousScene, firstInEpisode = false) {
  const description = project.description?.trim() || `เรื่อง ${project.title} แนว ${project.genre || "ผจญภัย"}`;
  const cast = (project.characters || []).map(c => c.name).filter(Boolean);
  const speaker = cast.length ? pick(cast) : "ตัวละครหลัก";
  const other = cast.filter(n => n !== speaker)[0] || "เพื่อนร่วมทีม";
  const prior = previousScene?.action?.trim();
  const location = previousScene?.location?.trim() || pick(["สถานที่หลักของเรื่อง", "บริเวณใกล้จุดเกิดเหตุ", "ทางเดินที่นำไปสู่เป้าหมาย"]);
  const actions = firstInEpisode
    ? [
        `ต่อเนื่องจากตอนก่อนที่ ${prior || "ภารกิจยังไม่สิ้นสุด"} ในตอนนี้ ${speaker} และ ${other} เริ่มต้นภารกิจช่วงใหม่ตามเรื่องย่อ: ${description} พวกเขาสังเกตสิ่งรอบตัวและพบเบาะแสที่จะพาไปสู่เหตุการณ์ถัดไป`,
        `เปิดตอนด้วยภาพ ${speaker} ทบทวนเหตุการณ์จากตอนก่อน (${prior || "การเดินทางที่ยังค้างอยู่"}) ก่อนชวน ${other} เดินหน้าตามเป้าหมายของเรื่อง ${description} ทั้งคู่พบรายละเอียดสำคัญที่ยังไม่มีใครสังเกต`,
        `หลังเหตุการณ์ในตอนก่อน ${speaker} และ ${other} มาถึงจุดต่อไปของภารกิจ พวกเขาพูดคุยถึงเป้าหมายตามเรื่อง ${description} แล้วพบอุปสรรคแรกของตอนนี้`
      ]
    : [
        `ต่อจากฉากก่อนที่ ${prior || "ตัวละครกำลังดำเนินภารกิจ"} ${speaker} สังเกตเห็นสิ่งผิดปกติและเรียก ${other} มาช่วยตรวจสอบ ทำให้เรื่อง ${project.title} เดินหน้าไปอีกขั้น`,
        `เหตุการณ์ต่อเนื่องจากฉากก่อน (${prior || "การสำรวจสถานที่"}) ${other} เสนอวิธีใหม่ ขณะที่ ${speaker} ทดลองทำตามและพบเบาะแสที่เชื่อมกับเรื่องย่อ: ${description}`,
        `ทันทีหลังฉากก่อน ${speaker} ตัดสินใจลงมือทำตามแผน แต่เกิดเหตุไม่คาดคิดที่ทำให้ ${other} ต้องช่วยแก้สถานการณ์ ทั้งคู่ยังคงมุ่งสู่เป้าหมายของเรื่อง ${project.title}`
      ];
  const dialogue = pick([
    `${speaker}: เราต้องเดินหน้าต่อ เป้าหมายของเรายังอยู่ข้างหน้า\n${other}: ตกลง แต่คราวนี้เราต้องสังเกตให้รอบคอบกว่าเดิม`,
    `${speaker}: เห็นนั่นไหม? ฉันคิดว่านี่อาจเป็นเบาะแสสำคัญ\n${other}: งั้นเราไปตรวจดูด้วยกัน อย่าเพิ่งรีบด่วนสรุป`,
    `${speaker}: แผนเปลี่ยนแล้ว เราต้องหาทางใหม่\n${other}: ฉันไปด้วยกัน เราจะหาคำตอบให้ได้`
  ]);
  return {
    id: uid(), title: `ฉากที่ ${sceneNumber}${firstInEpisode ? " — จุดเริ่มต้นภารกิจ" : " — เรื่องเดินหน้าต่อ"}`,
    duration: 8, location,
    action: pick(actions), dialogue,
    camera: pick(["เริ่มภาพกว้างเพื่อเห็นตำแหน่งตัวละคร แล้วค่อย ๆ ดอลลี่เข้าใบหน้า", "สลับภาพกลางของตัวละครกับภาพใกล้เบาะแส จบด้วยมุมที่ชวนติดตาม", "กล้องเคลื่อนตามตัวละครอย่างนุ่มนวล แล้วตัดภาพใกล้ปฏิกิริยา"]),
    sfx: pick(["เสียงบรรยากาศของสถานที่ เสียงฝีเท้า และเสียงเน้นเบา ๆ ตอนพบเบาะแส", "เสียงสภาพแวดล้อมต่อเนื่องจากฉากก่อน พร้อมเสียงประกอบตอนตัวละครตอบสนอง", "เสียงบรรยากาศสมจริง เสียงขยับตัว และเสียงดนตรีลุ้นเบา ๆ ตอนท้าย"]), prompt: ""
  };
}
const readLocal = () => { try { const v = JSON.parse(localStorage.getItem(STORE)); return Array.isArray(v) && v.length ? v : clone(seed); } catch { return clone(seed); } };

function makePrompt(project, episode, scene) {
  const chars = (project.characters || []).map(c =>
    `- ${c.name}: รูปลักษณ์ ${c.look || "ตามภาพอ้างอิง"}; เสื้อผ้า ${c.outfit || "คงเดิม"}; เสียง ${c.voice || "ภาษาไทย"}; ข้อกำหนด ${c.notes || "รักษาความต่อเนื่อง"}`
  ).join("\n");
  return `สร้างวิดีโอฉาก "${scene.title}" จากเรื่อง "${project.title}"\n` +
    `ประเภท: ${project.type} | แนว: ${project.genre} | สไตล์ภาพ: ${project.style}\n` +
    `ภาษาเสียงพูด: ${project.language} | อัตราส่วนภาพ: ${project.format}\n` +
    `ตอน: ${episode.title} | ความยาวฉาก: ${scene.duration || 8} วินาที\n\n` +
    `ล็อกตัวละครและความต่อเนื่อง:\n${chars || "- ใช้ตัวละครตามภาพอ้างอิง และคงรายละเอียดให้เหมือนเดิมทุกช็อต"}\n\n` +
    `สถานที่: ${scene.location || "ตามบท"}\nการกระทำ: ${scene.action || "ดำเนินเรื่องตามบท"}\n` +
    `บทพูด:\n${scene.dialogue || "ไม่มีบทพูด"}\n` +
    `กล้อง: ${scene.camera || "ภาพยนตร์ เคลื่อนกล้องนุ่มนวล"}\nเสียงประกอบ: ${scene.sfx || "เสียงบรรยากาศที่เข้ากับฉาก"}\n\n` +
    `ข้อกำหนด: พูดภาษาไทยเป็นธรรมชาติ ปากตรงกับเสียง ไม่มีข้อความหรือซับไตเติลบนจอ เว้นแต่ระบุไว้โดยผู้สร้าง รักษาหน้าตา สี ลาย ขนาดตัว เสื้อผ้า ฉาก และเสียงของตัวละครให้คงที่ ภาพเคลื่อนไหวลื่นไหล ไม่เปลี่ยนฉากกระตุก ไม่เพิ่มตัวละครที่ไม่ได้ระบุ`;
}

function IconButton({ children, onClick, title, className = "" }) {
  return <button className={`icon-btn ${className}`} onClick={onClick} title={title} aria-label={title}>{children}</button>;
}
function Field({ label, value, onChange, placeholder, multiline = false, type = "text" }) {
  return <label className="field"><span>{label}</span>{multiline
    ? <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} />
    : <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}</label>;
}
function SelectField({ label, value, onChange, options }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></label>;
}

export default function App() {
  const [projects, setProjects] = useState(readLocal);
  const [activeId, setActiveId] = useState(() => readLocal()[0]?.id);
  const [page, setPage] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [cloudStatus, setCloudStatus] = useState(supabase ? "พร้อมตั้งค่าฐานข้อมูล" : "โหมดทดลองในอุปกรณ์นี้");
  const [provider, setProvider] = useState("Google Flow");
  const [providerUrl, setProviderUrl] = useState("");
  const [apiModel, setApiModel] = useState("");
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("ซีรีส์");
  const [newGenre, setNewGenre] = useState("ผจญภัย");
  const [newIdea, setNewIdea] = useState("");
  const [activeEpisodeId, setActiveEpisodeId] = useState(null);
  const [activeSceneId, setActiveSceneId] = useState(null);
  const [promptMode, setPromptMode] = useState("flow");
  const [showPrompt, setShowPrompt] = useState(false);

  const active = projects.find(p => p.id === activeId) || projects[0];
  useEffect(() => { localStorage.setItem(STORE, JSON.stringify(projects)); }, [projects]);
  useEffect(() => {
    if (active && !activeEpisodeId) setActiveEpisodeId(active.episodes?.[0]?.id || null);
  }, [activeId]);
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(""), 2800); return () => clearTimeout(t); } }, [notice]);

  const episode = active?.episodes?.find(e => e.id === activeEpisodeId) || active?.episodes?.[0];
  const scene = episode?.scenes?.find(s => s.id === activeSceneId) || episode?.scenes?.[0];
  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const sceneCount = projects.reduce((n,p) => n + (p.episodes || []).reduce((m,e) => m + (e.scenes || []).length,0),0);
  const updateProject = (fn) => setProjects(old => old.map(p => p.id === activeId ? { ...fn(clone(p)), updatedAt: new Date().toISOString() } : p));
  const updateScene = (patch) => updateProject(p => {
    const ep = p.episodes.find(e => e.id === episode?.id);
    const sc = ep?.scenes.find(s => s.id === scene?.id);
    if (sc) Object.assign(sc, patch);
    return p;
  });
  const updateCharacter = (id, patch) => updateProject(p => { const c = p.characters.find(c => c.id === id); if (c) Object.assign(c, patch); return p; });

  const createProject = () => {
    if (!newTitle.trim()) { setNotice("กรุณาใส่ชื่อโปรเจกต์"); return; }
    const p = { id: uid(), title: newTitle.trim(), type: newType, genre: newGenre, style: "ภาพยนตร์คุณภาพสูง คุมโทนภาพให้คงที่", language: "ภาษาไทย", format: "9:16", description: newIdea, characters: [], episodes: [{ id: uid(), title: "ตอนที่ 1", scenes: [{ id: uid(), title: "ฉากที่ 1", duration: 8, location: "", action: newIdea, dialogue: "", camera: "", sfx: "", prompt: "" }] }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setProjects(old => [p, ...old]); setActiveId(p.id); setActiveEpisodeId(p.episodes[0].id); setActiveSceneId(p.episodes[0].scenes[0].id);
    setNewTitle(""); setNewIdea(""); setShowNew(false); setPage("editor"); setNotice("สร้างโปรเจกต์แล้ว");
  };
  const randomizeSynopsis = () => { if (!active) return; updateProject(p => ({ ...p, description: randomSynopsis(p) })); setNotice("สุ่มเรื่องย่อใหม่แล้ว"); };
  const addEpisode = () => {
    let createdEpisodeId = null, createdSceneId = null;
    updateProject(p => {
      p.episodes = p.episodes || [];
      if (!p.description?.trim()) p.description = randomSynopsis(p);
      const previousEpisode = p.episodes[p.episodes.length - 1];
      const previousScene = previousEpisode?.scenes?.[previousEpisode.scenes.length - 1];
      const number = p.episodes.length + 1;
      const e = { id: uid(), title: `ตอนที่ ${number}`, scenes: [buildSceneDraft(p, `ตอนที่ ${number}`, 1, previousScene, true)] };
      createdEpisodeId = e.id; createdSceneId = e.scenes[0].id; p.episodes.push(e); return p;
    });
    setActiveEpisodeId(createdEpisodeId); setActiveSceneId(createdSceneId); setNotice("เพิ่มตอนพร้อมสร้างฉากแรกให้แล้ว");
  };
  const addScene = () => {
    let createdSceneId = null;
    updateProject(p => {
      const ep = p.episodes.find(e => e.id === episode?.id);
      if (ep) {
        ep.scenes = ep.scenes || [];
        const previousScene = ep.scenes[ep.scenes.length - 1];
        const s = buildSceneDraft(p, ep.title, ep.scenes.length + 1, previousScene, ep.scenes.length === 0);
        createdSceneId = s.id; ep.scenes.push(s);
      }
      return p;
    });
    if (createdSceneId) { setActiveSceneId(createdSceneId); setNotice("เพิ่มฉากต่อเนื่องจากฉากก่อนหน้าแล้ว"); }
  };
  const deleteEpisode = (episodeId) => {
    const target = active?.episodes?.find(e => e.id === episodeId);
    if (!target || !confirm(`ต้องการลบ “${target.title}” และฉากทั้งหมดในตอนนี้หรือไม่?`)) return;
    const remaining = (active.episodes || []).filter(e => e.id !== episodeId);
    updateProject(p => ({ ...p, episodes: p.episodes.filter(e => e.id !== episodeId) }));
    const next = remaining[0]; setActiveEpisodeId(next?.id || null); setActiveSceneId(next?.scenes?.[0]?.id || null); setNotice("ลบตอนแล้ว");
  };
  const deleteScene = (sceneId) => {
    const target = episode?.scenes?.find(s => s.id === sceneId);
    if (!target || !confirm(`ต้องการลบ “${target.title}” หรือไม่?`)) return;
    const remaining = (episode.scenes || []).filter(s => s.id !== sceneId);
    updateProject(p => ({ ...p, episodes: p.episodes.map(e => e.id === episode.id ? { ...e, scenes: e.scenes.filter(s => s.id !== sceneId) } : e) }));
    const next = remaining[0]; setActiveSceneId(next?.id || null); setNotice("ลบฉากแล้ว");
  };
  const addCharacter = () => updateProject(p => { const c = { id: uid(), name: `ตัวละคร ${p.characters.length+1}`, role: "ตัวละครหลัก", look: "", outfit: "", voice: "เสียงพูดภาษาไทย", notes: "คงหน้าตา ขนาดตัว และรายละเอียดเหมือนเดิมทุกฉาก" }; p.characters.push(c); return p; });
  const removeProject = (id) => { if (!confirm("ลบโปรเจกต์นี้ออกจากรายการในอุปกรณ์นี้?")) return; const next = projects.filter(p => p.id !== id); setProjects(next.length ? next : []); if (activeId === id) { setActiveId(next[0]?.id); setPage("dashboard"); } };
  const copyText = async (text) => { try { await navigator.clipboard.writeText(text); setNotice("คัดลอกแล้ว"); } catch { setNotice("คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอก"); } };
  const downloadText = (filename, text) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" })); a.download = filename; a.click(); URL.revokeObjectURL(a.href); };
  const exportProject = () => downloadText(`${(active?.title || "ai-studio").replace(/[^\p{L}\p{N}-]/gu,"-")}.json`, JSON.stringify(active, null, 2));
  const generatedPrompt = active && episode && scene ? makePrompt(active, episode, scene) : "";

  const nav = [
    { id: "dashboard", label: "ภาพรวม", icon: LayoutDashboard },
    { id: "editor", label: "เขียนบท", icon: FileText },
    { id: "characters", label: "ตัวละคร", icon: Users },
    { id: "storyboard", label: "ฉากและช็อต", icon: Layers },
    { id: "video", label: "สร้างวิดีโอ", icon: Video },
    { id: "settings", label: "ตั้งค่า", icon: Settings }
  ];
  const go = (id) => { setPage(id); setMobileMenu(false); };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Aperture size={22}/></div><div><strong>AI STUDIO</strong><small>CREATIVE WORKSPACE</small></div><IconButton className="mobile-close" title="ปิดเมนู" onClick={() => setMobileMenu(false)}><X size={18}/></IconButton></div>
      <button className="new-project" onClick={() => setShowNew(true)}><Plus size={17}/> สร้างโปรเจกต์ใหม่</button>
      <div className="nav-caption">WORKSPACE</div>
      <nav>{nav.map(n => <button key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => go(n.id)}><n.icon size={18}/><span>{n.label}</span>{n.id === "video" && <span className="nav-tag">BETA</span>}</button>)}</nav>
      <div className="side-projects"><div className="nav-caption">โปรเจกต์ล่าสุด</div>{projects.slice(0,4).map(p => <button key={p.id} className={`project-link ${activeId===p.id?"selected":""}`} onClick={() => {setActiveId(p.id); setActiveEpisodeId(p.episodes?.[0]?.id); setActiveSceneId(p.episodes?.[0]?.scenes?.[0]?.id); go("editor");}}><span className="project-dot"/><span>{p.title}</span></button>)}</div>
      <div className="sidebar-bottom"><div className="plan-card"><Sparkles size={17}/><div><b>โหมดประหยัด</b><p>บันทึกงานในอุปกรณ์นี้</p></div><span className="status-dot"/></div><div className="user-mini"><div className="avatar">AI</div><div><b>ผู้สร้างผลงาน</b><small>{supabase ? "Cloud ready" : "Local workspace"}</small></div><CircleHelp size={17} className="muted"/></div></div>
    </aside>
    {mobileMenu && <div className="scrim" onClick={() => setMobileMenu(false)}/>}
    <main className="main">
      <header className="topbar"><div className="top-left"><IconButton className="menu-toggle" title="เปิดเมนู" onClick={() => setMobileMenu(true)}><Menu size={20}/></IconButton><div className="breadcrumb">พื้นที่ทำงาน <ChevronRight size={14}/> <b>{nav.find(n=>n.id===page)?.label}</b></div></div><div className="top-actions"><span className="save-state"><span className="status-dot"/> บันทึกในเครื่องอัตโนมัติ</span><IconButton title="ส่งออกโปรเจกต์" onClick={exportProject}><Download size={17}/></IconButton><div className="avatar">AI</div></div></header>
      <div className="content">
        {page === "dashboard" && <section>
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR STORY STARTS HERE</div><h1>สร้างเรื่องราวให้เป็นจริง<span className="gradient-dot">.</span></h1><p className="muted">จากไอเดียแรก สู่บทหนัง Storyboard และพรอมต์วิดีโอในพื้นที่เดียว</p></div><button className="primary-btn" onClick={() => setShowNew(true)}><Plus size={17}/> โปรเจกต์ใหม่</button></div>
          <div className="hero-card"><div className="hero-copy"><span className="pill"><WandSparkles size={13}/> AI STORY WORKFLOW</span><h2>ทุกฉากเริ่มจาก<br/><em>จินตนาการของคุณ</em></h2><p>จัดระเบียบเรื่อง ตัวละคร และรายละเอียดให้ต่อเนื่อง พร้อมเตรียมพรอมต์สำหรับเครื่องมือสร้างวิดีโอ</p><button className="light-btn" onClick={() => setShowNew(true)}>เริ่มสร้างเรื่อง <ArrowUpRight size={16}/></button></div><div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="film-frame"><div className="frame-top"><span/><span/><span/></div><div className="frame-image"><Clapperboard size={48}/><span>SCENE 01</span></div><div className="frame-bottom"><i/><i/><i/><i/><i/></div></div><div className="floating-card"><Sparkles size={14}/><span>Story → Scene → Video</span></div></div></div>
          <div className="stat-grid"><div className="stat-card"><div className="stat-icon purple"><Film size={18}/></div><div><span>โปรเจกต์ทั้งหมด</span><strong>{projects.length}</strong></div><small>เรื่อง</small></div><div className="stat-card"><div className="stat-icon blue"><Layers size={18}/></div><div><span>ฉากทั้งหมด</span><strong>{sceneCount}</strong></div><small>ฉาก</small></div><div className="stat-card"><div className="stat-icon pink"><Users size={18}/></div><div><span>ตัวละคร</span><strong>{projects.reduce((n,p)=>n+(p.characters?.length||0),0)}</strong></div><small>ตัว</small></div><div className="stat-card"><div className="stat-icon green"><Video size={18}/></div><div><span>การเชื่อมต่อวิดีโอ</span><strong className="small-stat">เตรียมพร้อม</strong></div><small>ตั้งค่าได้</small></div></div>
          <div className="section-head"><div><h2>โปรเจกต์ของคุณ</h2><p>เลือกเรื่องเพื่อเขียนบทและจัดการฉากต่อ</p></div><div className="searchbox"><Search size={16}/><input placeholder="ค้นหาโปรเจกต์..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
          <div className="project-grid">{filtered.map((p,i)=><article className="project-card" key={p.id}><div className={`project-cover cover-${i%4}`}><div className="cover-icon"><Clapperboard size={25}/></div><span className="cover-label">{p.type}</span><div className="cover-glow"/></div><div className="project-card-body"><div className="project-meta"><span>{p.genre}</span><span className="tiny-dot"/></div><h3>{p.title}</h3><p>{p.description || "ยังไม่มีเรื่องย่อ"}</p><div className="project-footer"><span><Layers size={14}/>{(p.episodes||[]).reduce((n,e)=>n+(e.scenes||[]).length,0)} ฉาก</span><span><Users size={14}/>{p.characters?.length||0} ตัวละคร</span><IconButton title="เปิดโปรเจกต์" onClick={()=>{setActiveId(p.id);setActiveEpisodeId(p.episodes?.[0]?.id);setActiveSceneId(p.episodes?.[0]?.scenes?.[0]?.id);go("editor")}}><ChevronRight size={17}/></IconButton></div></div></article>)}
            <button className="add-project-card" onClick={() => setShowNew(true)}><span className="add-circle"><Plus size={22}/></span><b>เริ่มเรื่องใหม่</b><small>เปลี่ยนไอเดียให้เป็นโปรเจกต์</small></button></div>
        </section>}

        {page === "editor" && <section>
          <div className="page-heading"><div><div className="eyebrow">SCRIPT WORKSPACE</div><h1>เขียนบท <span className="gradient-dot">.</span></h1><p className="muted">จัดการเรื่องย่อ ตอน และบทสนทนาในที่เดียว</p></div><button className="secondary-btn" onClick={exportProject}><Download size={16}/> ส่งออก JSON</button></div>
          {!active ? <Empty title="ยังไม่มีโปรเจกต์" text="สร้างโปรเจกต์แรกเพื่อเริ่มเขียนบท" action={()=>setShowNew(true)}/> : <div className="editor-layout"><div className="editor-main panel"><div className="panel-title"><div className="title-icon"><FileText size={18}/></div><div><h3>ข้อมูลเรื่อง</h3><p>แก้ไขได้ตลอดเวลา</p></div><span className="autosave-label"><Check size={13}/> Auto-save</span></div>
            <div className="form-grid"><Field label="ชื่อเรื่อง" value={active.title} onChange={v=>updateProject(p=>({...p,title:v}))}/><SelectField label="ประเภทผลงาน" value={active.type} onChange={v=>updateProject(p=>({...p,type:v}))} options={["ภาพยนตร์","ซีรีส์","ซีรีส์การ์ตูน","แอนิเมชัน","หนังสั้น","โฆษณา"]}/><Field label="แนวเรื่อง" value={active.genre} onChange={v=>updateProject(p=>({...p,genre:v}))}/><SelectField label="อัตราส่วนภาพ" value={active.format} onChange={v=>updateProject(p=>({...p,format:v}))} options={["9:16","16:9","1:1","4:5"]}/><div className="full synopsis-field"><Field label="เรื่องย่อ / ไอเดียหลัก" value={active.description} onChange={v=>updateProject(p=>({...p,description:v}))} multiline placeholder="เล่าไอเดียหลัก ตัวละคร และเป้าหมายของเรื่อง..."/><button className="secondary-btn synopsis-random" onClick={randomizeSynopsis}><WandSparkles size={15}/> สุ่มเรื่องย่อ</button></div><Field label="สไตล์ภาพ" value={active.style} onChange={v=>updateProject(p=>({...p,style:v}))}/><SelectField label="ภาษาบทและเสียง" value={active.language} onChange={v=>updateProject(p=>({...p,language:v}))} options={["ภาษาไทย","ไทยเป็นหลัก + ภาษาอื่น","English","หลายภาษา"]}/></div>
            <div className="episode-header"><div><h3>ตอนและฉาก</h3><p>เลือกตอนหรือเพิ่มตอนใหม่</p></div><button className="small-primary" onClick={addEpisode}><Plus size={15}/> เพิ่มตอน</button></div>
            <div className="episode-tabs">{(active.episodes||[]).map(e=><div className="episode-tab-item" key={e.id}><button className={episode?.id===e.id?"selected":""} onClick={()=>{setActiveEpisodeId(e.id);setActiveSceneId(e.scenes?.[0]?.id || null)}}>{e.title}</button><button className="mini-delete" title={`ลบ ${e.title}`} aria-label={`ลบ ${e.title}`} onClick={()=>deleteEpisode(e.id)}><Trash2 size={13}/></button></div>)}</div>
            <div className="scene-pills">{(episode?.scenes||[]).map((s,i)=><div className="scene-pill-item" key={s.id}><button className={scene?.id===s.id?"selected":""} onClick={()=>setActiveSceneId(s.id)}><span>{String(i+1).padStart(2,"0")}</span>{s.title}</button><button className="mini-delete" title={`ลบ ${s.title}`} aria-label={`ลบ ${s.title}`} onClick={()=>deleteScene(s.id)}><Trash2 size={12}/></button></div>)}<button className="add-scene-pill" onClick={addScene}><Plus size={15}/> เพิ่มฉาก</button></div>
            {scene && <div className="scene-editor"><div className="scene-title-row"><div><span className="eyebrow">SCENE {String((episode?.scenes||[]).findIndex(s=>s.id===scene.id)+1).padStart(2,"0")}</span><h3>{scene.title}</h3></div><SelectField label="ความยาว" value={String(scene.duration||8)} onChange={v=>updateScene({duration:Number(v)})} options={["5","8","10","12","15","20","30","60"]}/></div><div className="form-grid"><Field label="ชื่อฉาก" value={scene.title} onChange={v=>updateScene({title:v})}/><Field label="สถานที่" value={scene.location} onChange={v=>updateScene({location:v})}/><div className="full"><Field label="การกระทำ / สิ่งที่เกิดขึ้น" value={scene.action} onChange={v=>updateScene({action:v})} multiline placeholder="ตัวละครทำอะไร สีหน้า ท่าทาง และการเคลื่อนไหว..."/></div><div className="full"><Field label="บทพูด" value={scene.dialogue} onChange={v=>updateScene({dialogue:v})} multiline placeholder="ชื่อตัวละคร: บทพูดภาษาไทย..."/></div><div className="full"><Field label="มุมกล้องและการเคลื่อนกล้อง" value={scene.camera} onChange={v=>updateScene({camera:v})} placeholder="เช่น ภาพกว้าง → ภาพใกล้ สลับมุมตามบท"/></div><div className="full"><Field label="เสียงประกอบ / SFX" value={scene.sfx} onChange={v=>updateScene({sfx:v})} placeholder="เช่น เสียงฝีเท้า เสียงบรรยากาศ เสียงมุกตลก"/></div></div><div className="prompt-inline"><div><Sparkles size={16}/><div><b>พร้อมสร้าง Prompt</b><small>รวมข้อมูลตัวละครและข้อกำหนดความต่อเนื่องให้อัตโนมัติ</small></div></div><button className="primary-btn" onClick={()=>{setPage("video");setShowPrompt(true)}}>สร้าง Prompt <ChevronRight size={16}/></button></div></div>}
          </div><aside className="editor-aside"><div className="panel"><div className="panel-title"><Users size={17}/><h3>ตัวละครในเรื่อง</h3><span className="count-badge">{active.characters?.length||0}</span></div>{(active.characters||[]).slice(0,4).map(c=><div className="mini-character" key={c.id}><div className="character-avatar">{c.name.slice(0,1)}</div><div><b>{c.name}</b><small>{c.role}</small></div></div>)}<button className="outline-btn full-btn" onClick={()=>go("characters")}><Users size={15}/> จัดการตัวละคร</button></div><div className="panel continuity-panel"><div className="continuity-head"><Sparkles size={17}/><b>Continuity Check</b></div><p>ใช้รายละเอียดตัวละครที่บันทึกไว้ในทุก Prompt</p><div className="check-row"><Check size={14}/> รูปลักษณ์ตัวละคร</div><div className="check-row"><Check size={14}/> เสื้อผ้าและขนาดตัว</div><div className="check-row"><Check size={14}/> ภาษาและเสียงพูด</div><small className="muted">ระบบช่วยใส่ข้อกำหนดใน Prompt แต่ผลลัพธ์วิดีโอยังต้องตรวจสอบ</small></div></aside></div>}
        </section>}

        {page === "characters" && <section><div className="page-heading"><div><div className="eyebrow">CHARACTER BIBLE</div><h1>คลังตัวละคร <span className="gradient-dot">.</span></h1><p className="muted">เก็บรายละเอียดตัวละครเพื่อใช้ซ้ำในทุกตอน</p></div><button className="primary-btn" onClick={addCharacter}><Plus size={16}/> เพิ่มตัวละคร</button></div>{!active ? <Empty title="ยังไม่มีโปรเจกต์" text="สร้างโปรเจกต์เพื่อเริ่มเพิ่มตัวละคร" action={()=>setShowNew(true)}/> : <><div className="info-banner"><Sparkles size={18}/><div><b>Character Bible</b><p>กรอกรายละเอียดให้ชัดเจน ระบบจะนำไปแนบใน Prompt ของทุกฉากเพื่อช่วยรักษาความต่อเนื่อง</p></div></div><div className="character-grid">{(active.characters||[]).map((c,i)=><article className="character-card" key={c.id}><div className={`character-cover char-cover-${i%4}`}><div className="character-avatar large">{c.name.slice(0,1)}</div><span>CHARACTER {String(i+1).padStart(2,"0")}</span></div><div className="character-fields"><Field label="ชื่อตัวละคร" value={c.name} onChange={v=>updateCharacter(c.id,{name:v})}/><Field label="บทบาท" value={c.role} onChange={v=>updateCharacter(c.id,{role:v})}/><Field label="รูปลักษณ์ / ภาพอ้างอิง" value={c.look} onChange={v=>updateCharacter(c.id,{look:v})} placeholder="สี ลาย รูปร่าง ใบหน้า หรือภาพอ้างอิง"/><Field label="เสื้อผ้า (ล็อกให้เหมือนกัน)" value={c.outfit} onChange={v=>updateCharacter(c.id,{outfit:v})}/><Field label="เสียงพูด" value={c.voice} onChange={v=>updateCharacter(c.id,{voice:v})}/><Field label="ข้อกำหนดความต่อเนื่อง" value={c.notes} onChange={v=>updateCharacter(c.id,{notes:v})} multiline/><button className="delete-link" onClick={()=>{if(confirm("ลบตัวละครนี้?")) updateProject(p=>({...p,characters:p.characters.filter(x=>x.id!==c.id)}))}}><Trash2 size={14}/> ลบตัวละคร</button></div></article>)}<button className="add-character" onClick={addCharacter}><span><Plus size={24}/></span><b>เพิ่มตัวละครใหม่</b><small>สร้าง character bible สำหรับเรื่องนี้</small></button></div></>}</section>}

        {page === "storyboard" && <section><div className="page-heading"><div><div className="eyebrow">SCENE BUILDER</div><h1>ฉากและช็อต <span className="gradient-dot">.</span></h1><p className="muted">จัดลำดับฉาก ระยะเวลา กล้อง และบทพูด</p></div><button className="primary-btn" onClick={()=>{if(!active){setShowNew(true);return;}addScene()}}><Plus size={16}/> เพิ่มฉาก</button></div>{!active ? <Empty title="ยังไม่มีโปรเจกต์" text="สร้างโปรเจกต์เพื่อเริ่มวางฉาก" action={()=>setShowNew(true)}/> : <div className="storyboard-layout"><div className="storyboard-toolbar"><div><b>{active.title}</b><small>{episode?.title || "ยังไม่มีตอน"}</small></div><SelectField label="เลือกตอน" value={episode?.id||""} onChange={v=>{setActiveEpisodeId(v);setActiveSceneId(active.episodes.find(e=>e.id===v)?.scenes?.[0]?.id)}} options={(active.episodes||[]).map(e=>e.id)}/><button className="small-primary" onClick={addEpisode}><Plus size={14}/> ตอน</button></div><div className="shot-list">{(episode?.scenes||[]).map((s,i)=><article className={`shot-card ${scene?.id===s.id?"current":""}`} key={s.id} onClick={()=>setActiveSceneId(s.id)}><div className="shot-number">{String(i+1).padStart(2,"0")}</div><div className={`shot-thumb shot-thumb-${i%4}`}><Play size={19}/></div><div className="shot-details"><div className="shot-meta"><span>SCENE {String(i+1).padStart(2,"0")}</span><span><Clock3 size={12}/>{s.duration||8} วินาที</span></div><h3>{s.title}</h3><p>{s.action || "ยังไม่มีรายละเอียดการกระทำ"}</p><div className="shot-chips"><span><Camera size={12}/>{s.camera || "ยังไม่ระบุมุมกล้อง"}</span><span><Mic2 size={12}/>{s.dialogue ? "มีบทพูด" : "ไม่มีบทพูด"}</span></div></div><IconButton title="แก้ไขฉาก" onClick={e=>{e?.stopPropagation?.();setPage("editor")}}><ChevronRight size={17}/></IconButton></article>)}</div>{!(episode?.scenes||[]).length&&<Empty title="ยังไม่มีฉาก" text="เพิ่มฉากแรกเพื่อเริ่ม Storyboard" action={addScene}/>}</div>}</section>}

        {page === "video" && <section><div className="page-heading"><div><div className="eyebrow">VIDEO WORKFLOW</div><h1>สร้างวิดีโอ <span className="gradient-dot">.</span></h1><p className="muted">สร้าง Prompt สำหรับ Flow หรือเตรียมเชื่อมต่อบริการวิดีโอผ่าน API</p></div><span className="beta-pill"><span className="status-dot"/> PROMPT STUDIO</span></div>{!active ? <Empty title="ยังไม่มีโปรเจกต์" text="สร้างโปรเจกต์เพื่อเตรียม Prompt วิดีโอ" action={()=>setShowNew(true)}/> : <div className="video-workspace"><div className="video-settings panel"><div className="panel-title"><div className="title-icon"><Video size={18}/></div><div><h3>ตั้งค่าการสร้าง</h3><p>เลือกวิธีนำ Prompt ไปใช้งาน</p></div></div><div className="mode-select"><button className={promptMode==="flow"?"selected":""} onClick={()=>setPromptMode("flow")}><div className="mode-icon flow-icon"><Sparkles size={19}/></div><div><b>Google Flow</b><small>สร้าง Prompt แล้วนำไปวางใน Flow</small></div><span className="radio-dot"/></button><button className={promptMode==="api"?"selected":""} onClick={()=>setPromptMode("api")}><div className="mode-icon api-icon"><Link2 size={19}/></div><div><b>Video API</b><small>เตรียมเชื่อมต่อผู้ให้บริการ</small></div><span className="radio-dot"/></button></div>
            <div className="form-grid"><SelectField label="โปรเจกต์" value={active.id} onChange={v=>{setActiveId(v);setActiveEpisodeId(projects.find(p=>p.id===v)?.episodes?.[0]?.id);setActiveSceneId(projects.find(p=>p.id===v)?.episodes?.[0]?.scenes?.[0]?.id)}} options={projects.map(p=>p.id)}/><SelectField label="ตอน" value={episode?.id||""} onChange={v=>{setActiveEpisodeId(v);setActiveSceneId(active.episodes.find(e=>e.id===v)?.scenes?.[0]?.id)}} options={(active.episodes||[]).map(e=>e.id)}/><div className="full"><SelectField label="ฉาก" value={scene?.id||""} onChange={setActiveSceneId} options={(episode?.scenes||[]).map(s=>s.id)}/></div></div>
            {promptMode==="flow" ? <div className="integration-note"><div className="note-icon"><Sparkles size={17}/></div><div><b>โหมด Google Flow</b><p>เว็บนี้จัด Prompt ให้พร้อมคัดลอกไปใช้ใน Google Flow ยังไม่มีการสั่งสร้างวิดีโอจาก Flow โดยตรง</p><a href="https://labs.google/fx/tools/flow" target="_blank" rel="noreferrer">เปิด Google Flow <ArrowUpRight size={13}/></a></div></div> : <div className="integration-note api-note"><div className="note-icon"><Link2 size={17}/></div><div><b>โหมด Video API</b><p>ยังไม่เชื่อมผู้ให้บริการ การสร้างจริงต้องมี API ที่รองรับและตั้งค่า secret บน server-side</p><span className="coming-soon">ยังไม่เชื่อมต่อ</span></div></div>}
          </div><div className="prompt-panel panel"><div className="prompt-head"><div><div className="eyebrow">GENERATED PROMPT</div><h3>{scene?.title || "เลือกฉาก"}</h3><p>{active.title} / {episode?.title || ""} / {scene?.duration||8} วินาที</p></div><span className="prompt-status"><Sparkles size={13}/> AUTO COMPOSED</span></div><div className="prompt-preview">{generatedPrompt || "เลือกโปรเจกต์และฉากเพื่อสร้าง Prompt"}</div><div className="prompt-actions"><button className="secondary-btn" onClick={()=>copyText(generatedPrompt)}><Copy size={15}/> คัดลอก Prompt</button><button className="primary-btn" onClick={()=>downloadText("video-prompt.txt",generatedPrompt)}><Download size={15}/> ดาวน์โหลด .txt</button></div><div className="prompt-foot"><Check size={14}/><span>รวมข้อมูลตัวละครและข้อกำหนดความต่อเนื่องแล้ว</span><button onClick={()=>go("editor")}>แก้ไขบท <ChevronRight size={13}/></button></div></div></div>}
          <div className="warning-note"><CircleHelp size={17}/><p><b>สถานะ MVP:</b> เวอร์ชันนี้สร้างบท จัดฉาก บันทึกโปรเจกต์ และส่งออก Prompt ได้จริง การสร้างวิดีโอผ่าน API จะยังไม่ทำงานจนกว่าจะเชื่อมต่อบริการที่รองรับและตั้งค่าคีย์อย่างปลอดภัย</p></div>
        </section>}

        {page === "settings" && <section><div className="page-heading"><div><div className="eyebrow">WORKSPACE SETTINGS</div><h1>ตั้งค่า <span className="gradient-dot">.</span></h1><p className="muted">จัดการข้อมูลและการเชื่อมต่อสำหรับเวิร์กโฟลว์ของคุณ</p></div></div><div className="settings-layout"><div className="panel"><div className="panel-title"><div className="title-icon"><FolderOpen size={18}/></div><div><h3>พื้นที่จัดเก็บ</h3><p>ข้อมูลโปรเจกต์และตัวละคร</p></div></div><div className="connection-row"><div className="connection-icon"><Save size={18}/></div><div><b>บันทึกในอุปกรณ์นี้</b><small>ข้อมูลเก็บใน localStorage ของเบราว์เซอร์นี้</small></div><span className="connected-badge">ใช้งานอยู่</span></div><div className="connection-row"><div className="connection-icon cloud"><Layers size={18}/></div><div><b>Supabase Cloud</b><small>{supabase ? "พบค่าการเชื่อมต่อจาก environment" : "ยังไม่ตั้งค่า URL และ publishable/anon key"}</small></div><span className={`connection-badge ${supabase?"good":""}`}>{supabase?"ตั้งค่าแล้ว":"ยังไม่เชื่อม"}</span></div><p className="help-text">เพื่อบันทึกข้ามอุปกรณ์ ต้องเพิ่ม Supabase Auth และตารางตามไฟล์ supabase/schema.sql ในชุดโปรเจกต์นี้ การเชื่อมต่อฐานข้อมูลยังไม่ถูกเปิดใช้จนกว่าจะตั้งค่าและทดสอบสิทธิ์ผู้ใช้ครบถ้วน</p></div>
          <div className="panel"><div className="panel-title"><div className="title-icon"><Video size={18}/></div><div><h3>ผู้ให้บริการวิดีโอ</h3><p>ตั้งค่าการเชื่อมต่อในขั้นตอนถัดไป</p></div></div><SelectField label="โหมดหลัก" value={provider} onChange={setProvider} options={["Google Flow","Video API","ทั้งสองแบบ"]}/><Field label="ชื่อผู้ให้บริการ API (ถ้ามี)" value={apiModel} onChange={setApiModel} placeholder="เช่น ชื่อโมเดลหรือผู้ให้บริการ"/><Field label="URL ของ endpoint ฝั่งเซิร์ฟเวอร์ (ไม่ใส่ API key ที่นี่)" value={providerUrl} onChange={setProviderUrl} placeholder="https://your-server.example/api/video"/><div className="api-key-warning"><Settings size={15}/><span>ห้ามใส่ Secret API Key ในหน้าเว็บหรือไฟล์ที่ส่งขึ้น GitHub ให้เก็บใน environment variables ของ backend เท่านั้น</span></div><button className="secondary-btn" onClick={()=>setNotice("บันทึกค่าหน้าจอในเซสชันนี้แล้ว — ยังไม่มีการเรียก API") }><Save size={15}/> บันทึกค่าหน้าจอ</button></div>
          <div className="panel"><div className="panel-title"><div className="title-icon"><Download size={18}/></div><div><h3>ส่งออกและสำรองข้อมูล</h3><p>เก็บสำเนาโปรเจกต์ไว้ได้เสมอ</p></div></div><p className="help-text">ส่งออก JSON เพื่อสำรองบท ตัวละคร และฉากทั้งหมด รวมถึงนำข้อมูลไปย้ายไปยังเครื่องอื่นได้</p><div className="settings-actions"><button className="secondary-btn" onClick={exportProject}><Download size={15}/> ส่งออกโปรเจกต์ปัจจุบัน</button><label className="secondary-btn file-import"><RefreshCw size={15}/> นำเข้า JSON<input type="file" accept=".json,application/json" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const p=JSON.parse(r.result);if(!p.title||!Array.isArray(p.episodes))throw new Error();p.id=uid();setProjects(old=>[p,...old]);setActiveId(p.id);setPage("editor");setNotice("นำเข้าโปรเจกต์สำเร็จ")}catch{setNotice("ไฟล์ JSON ไม่ถูกต้อง")}e.target.value=""};r.readAsText(f)}}/></label></div></div></div></section>}
      </div>
      <footer className="footer"><span><Aperture size={14}/> AI STUDIO <small>VERSION 1.0 MVP</small></span><span>Made for stories that move people.</span></footer>
    </main>

    {showNew && <div className="modal-backdrop" onClick={()=>setShowNew(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">NEW PROJECT</span><h2>เริ่มเรื่องใหม่</h2><p>สร้างพื้นที่สำหรับเรื่องราวของคุณ</p></div><IconButton title="ปิด" onClick={()=>setShowNew(false)}><X size={18}/></IconButton></div><Field label="ชื่อโปรเจกต์" value={newTitle} onChange={setNewTitle} placeholder="เช่น แมวผจญภัยในโลกกว้าง"/><div className="form-grid"><SelectField label="ประเภท" value={newType} onChange={setNewType} options={["ภาพยนตร์","ซีรีส์","ซีรีส์การ์ตูน","แอนิเมชัน","หนังสั้น","โฆษณา"]}/><SelectField label="แนวเรื่อง" value={newGenre} onChange={setNewGenre} options={["ผจญภัย","คอมเมดี้","ดราม่า","แฟนตาซี","สยองขวัญ","โรแมนติก","ไซไฟ","สารคดี"]}/></div><Field label="ไอเดียเรื่องย่อ" value={newIdea} onChange={setNewIdea} multiline placeholder="เล่าไอเดียสั้น ๆ แล้วค่อยขยายในหน้าเขียนบท"/><div className="modal-actions"><button className="secondary-btn" onClick={()=>setShowNew(false)}>ยกเลิก</button><button className="primary-btn" onClick={createProject}><Plus size={16}/> สร้างโปรเจกต์</button></div></div></div>}
    {notice && <div className="toast"><Check size={16}/>{notice}</div>}
  </div>;
}

function Empty({ title, text, action }) { return <div className="empty-state"><div className="empty-icon"><Film size={25}/></div><h3>{title}</h3><p>{text}</p><button className="primary-btn" onClick={action}><Plus size={16}/> เริ่มต้น</button></div>; }
