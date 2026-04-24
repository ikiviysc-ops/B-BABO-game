/* ========================================
   搜刮大师 - 游戏核心逻辑
   基于 v5.0 开发文档
   P3: 鉴定+背包增强
   ======================================== */

// ========== 音效系统 ==========
const SFX = {
  ctx: null,
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
  play(type) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain); gain.connect(this.ctx.destination);
      const t = this.ctx.currentTime;
      const sounds = {
        dig:      () => { osc.frequency.setValueAtTime(200,t); osc.frequency.exponentialRampToValueAtTime(100,t+0.1); gain.gain.setValueAtTime(0.15,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.1); osc.start(t); osc.stop(t+0.1); },
        reveal:   () => { osc.frequency.setValueAtTime(300,t); osc.frequency.exponentialRampToValueAtTime(600,t+0.15); gain.gain.setValueAtTime(0.12,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.15); osc.start(t); osc.stop(t+0.15); },
        rare:     () => { osc.type='sine'; osc.frequency.setValueAtTime(500,t); osc.frequency.exponentialRampToValueAtTime(800,t+0.2); gain.gain.setValueAtTime(0.15,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.25); osc.start(t); osc.stop(t+0.25); },
        epic:     () => { osc.type='sine'; osc.frequency.setValueAtTime(600,t); osc.frequency.setValueAtTime(800,t+0.1); gain.gain.setValueAtTime(0.15,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.3); osc.start(t); osc.stop(t+0.3); },
        legend:   () => { osc.type='sine'; osc.frequency.setValueAtTime(600,t); osc.frequency.setValueAtTime(800,t+0.1); osc.frequency.setValueAtTime(1000,t+0.2); gain.gain.setValueAtTime(0.18,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.4); osc.start(t); osc.stop(t+0.4); },
        mythic:   () => { osc.type='sine'; osc.frequency.setValueAtTime(800,t); osc.frequency.setValueAtTime(1000,t+0.08); osc.frequency.setValueAtTime(1200,t+0.16); osc.frequency.setValueAtTime(1500,t+0.24); gain.gain.setValueAtTime(0.2,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.5); osc.start(t); osc.stop(t+0.5); },
        empty:    () => { osc.frequency.setValueAtTime(150,t); gain.gain.setValueAtTime(0.08,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.08); osc.start(t); osc.stop(t+0.08); },
        event:    () => { osc.type='triangle'; osc.frequency.setValueAtTime(400,t); osc.frequency.setValueAtTime(600,t+0.1); osc.frequency.setValueAtTime(400,t+0.2); gain.gain.setValueAtTime(0.15,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.3); osc.start(t); osc.stop(t+0.3); },
        click:    () => { osc.frequency.setValueAtTime(800,t); gain.gain.setValueAtTime(0.08,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.05); osc.start(t); osc.stop(t+0.05); },
        success:  () => { osc.type='sine'; osc.frequency.setValueAtTime(500,t); osc.frequency.setValueAtTime(700,t+0.1); gain.gain.setValueAtTime(0.12,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.25); osc.start(t); osc.stop(t+0.25); },
        appraise: () => { osc.type='sine'; osc.frequency.setValueAtTime(400,t); osc.frequency.setValueAtTime(600,t+0.15); osc.frequency.setValueAtTime(800,t+0.3); osc.frequency.setValueAtTime(1000,t+0.45); gain.gain.setValueAtTime(0.12,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.6); osc.start(t); osc.stop(t+0.6); },
        repair:   () => { osc.type='square'; osc.frequency.setValueAtTime(300,t); osc.frequency.setValueAtTime(500,t+0.1); osc.frequency.setValueAtTime(300,t+0.2); gain.gain.setValueAtTime(0.1,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.3); osc.start(t); osc.stop(t+0.3); },
        buy:      () => { osc.type='sine'; osc.frequency.setValueAtTime(600,t); osc.frequency.exponentialRampToValueAtTime(400,t+0.08); gain.gain.setValueAtTime(0.12,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.12); osc.start(t); osc.stop(t+0.12); },
        coin:     () => { osc.type='sine'; osc.frequency.setValueAtTime(1200,t); osc.frequency.exponentialRampToValueAtTime(800,t+0.15); gain.gain.setValueAtTime(0.1,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.2); osc.start(t); osc.stop(t+0.2); }
      };
      if (sounds[type]) sounds[type]();
    } catch(e) {}
  }
};

// ========== 游戏数据管理 ==========
const GameData = {
  version: 2, // v2: 图片图标
  defaultData() {
    return {
      version: 2,
      player: { name:'探索新手', level:1, exp:0, gold:5000, stamina:100, maxStamina:100 },
      skills: { lootRate:1, appraiseEye:1, durability:1, stamina:1, repair:1, negotiation:1 },
      inventory: [], collection: [],
      museum: { level:1, exhibits:[], dailyVisitors:0, dailyIncome:0, totalIncome:0, reputation:0, ticketPrice:30, ticketMult:1.0, bizHoursUsed:0, isBizOpen:false, bizStartTime:0, lastBizDate:'' },
      auctions: [], maps: { currentMap:0, unlockedMaps:[0] },
      backpack: { level:0, rows:4, cols:5 },
      digBackpack: { level: 1 },
      digItems: [], // 探索背包物品（持久化）
      stats: { totalLooted:0, totalAppraised:0, totalSold:0, totalEarned:0, totalRepaired:0, totalExhibited:0, totalVisitors:0 },
      achievements: [],       // 已解锁成就ID列表
      dailyTasks: { dig:0, appraise:0, sell:0, exhibit:0, lastResetDate:'' },
      signIn: { lastDate:'', streak:0, totalDays:0 },
      ads: { staminaToday:0, doubleToday:0, appraiseToday:0, refreshToday:0, lastResetDate:'' },
      staminaRecovery: { lastRecoveryTime:Date.now(), lastFullTime:Date.now() },
      lastSaveTime: Date.now()
    };
  },
  data: null, STORAGE_KEY: 'loot_master_save',
  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 版本不匹配则重置
        if (!parsed.version || parsed.version < this.version) {
          console.log('版本更新，重置数据...');
          this.data = this.defaultData();
          this.data.version = this.version;
        } else {
          this.data = parsed;
          this._mergeData(this.data, this.defaultData());
        }
      }
      else { this.data = this.defaultData(); this.data.version = this.version; }
    } catch(e) { this.data = this.defaultData(); this.data.version = this.version; }
  },
  save() { try { this.data.lastSaveTime=Date.now(); localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data)); } catch(e){} },
  _mergeData(t,s) { for(const k in s) { if(!(k in t)) t[k]=JSON.parse(JSON.stringify(s[k])); else if(typeof s[k]==='object'&&!Array.isArray(s[k])&&s[k]!==null) this._mergeData(t[k],s[k]); } },
  exportSave() { return JSON.stringify(this.data); },
  importSave(j) { try { this.data=JSON.parse(j); this.save(); return true; } catch(e) { return false; } },
  resetSave() { this.data=this.defaultData(); this.save(); }
};

// ========== 数据常量 ==========
const ZONES = [
  { name:'能源设施',stars:1,ticket:0,description:'工业能源基地，产出普通枪械和基础配件。冷却系统旁常有遗留物资。',qualityRange:['civ','upg'],gridSize:{cols:6,rows:8},eventChance:0.05,icon:'⚡',bgClass:'zone-bg--energy',pos:{x:22,y:28},loot:'普通枪械、基础配件',unlockDesc:'默认解锁',unlockType:'default' },
  { name:'指挥中心',stars:2,ticket:2000,description:'六角形要塞指挥所，可找到改良武器和通讯设备。卫星阵列区域有高价值物资。',qualityRange:['civ','upg','rar'],gridSize:{cols:6,rows:8},eventChance:0.08,icon:'📡',bgClass:'zone-bg--command',pos:{x:72,y:18},loot:'改良武器、通讯设备',unlockDesc:'累计出售10件物品',unlockType:'stat',unlockKey:'totalSold',unlockVal:10 },
  { name:'研究穹顶',stars:3,ticket:15000,description:'蓝色生物研究穹顶，精良装备和实验器材的来源。实验室区域需要小心。',qualityRange:['upg','rar','epi'],gridSize:{cols:6,rows:8},eventChance:0.1,icon:'🔬',bgClass:'zone-bg--research',pos:{x:48,y:48},loot:'精良装备、实验器材',unlockDesc:'累计鉴定20件物品',unlockType:'stat',unlockKey:'totalAppraised',unlockVal:20 },
  { name:'太空港',stars:4,ticket:80000,description:'双火箭发射平台，精良到史诗级武器装备。发射井周围有军事物资。',qualityRange:['rar','epi','leg'],gridSize:{cols:6,rows:8},eventChance:0.12,icon:'🚀',bgClass:'zone-bg--spaceport',pos:{x:22,y:72},loot:'史诗武器、航天装备',unlockDesc:'达到Lv.5',unlockType:'level',unlockVal:5 },
  { name:'制造工厂',stars:5,ticket:500000,description:'金色军工制造中心，史诗和传说级武器装备。核心区域守卫森严。',qualityRange:['epi','leg','myt'],gridSize:{cols:6,rows:8},eventChance:0.15,icon:'🏭',bgClass:'zone-bg--factory',pos:{x:75,y:75},loot:'传说武器、军工装备',unlockDesc:'达到Lv.10',unlockType:'level',unlockVal:10 }
];
const BACKPACK_LEVELS = [
  {name:'初始仓库',rows:4,cols:5,cost:0},{name:'铝合金箱',rows:5,cols:6,cost:500},
  {name:'钛合金箱',rows:6,cols:7,cost:2000},{name:'碳纤维箱',rows:7,cols:8,cost:8000},
  {name:'凯夫拉箱',rows:8,cols:9,cost:20000},{name:'黑金箱',rows:9,cols:10,cost:50000}
];
const ITEMS_DB = {
  // 枪械 (120件)
  gun: [
    {name: "AK-12", icon: "assets/icons/AK-12.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "AK-47", icon: "assets/icons/AK-47.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "AK-74M", icon: "assets/icons/AK-74M.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "AKS-74U", icon: "assets/icons/AKS-74U.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "AN-94", icon: "assets/icons/AN-94.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "AUG A1", icon: "assets/icons/AUG_A1.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "AUG A3", icon: "assets/icons/AUG_A3.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "AUG Para", icon: "assets/icons/AUG_Para.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "CZ 805 BREN", icon: "assets/icons/CZ_805_BREN.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "FAMAS F1", icon: "assets/icons/FAMAS_F1.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "FAMAS G2", icon: "assets/icons/FAMAS_G2.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "FAMAS Valoris\u00e9", icon: "assets/icons/FAMAS_Valoris\u00e9.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "FN F2000", icon: "assets/icons/FN_F2000.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "FN FAL", icon: "assets/icons/FN_FAL.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "FN FNC", icon: "assets/icons/FN_FNC.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "G36", icon: "assets/icons/G36.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "G36C", icon: "assets/icons/G36C.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Galil ARM", icon: "assets/icons/Galil_ARM.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "HK416", icon: "assets/icons/HK416.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "HK53", icon: "assets/icons/HK53.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "HK G3", icon: "assets/icons/HK_G3.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "M16A1", icon: "assets/icons/M16A1.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "M16A4", icon: "assets/icons/M16A4.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "M16A4 M203", icon: "assets/icons/M16A4_M203.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "M4A1", icon: "assets/icons/M4A1.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "QBZ-95-1", icon: "assets/icons/QBZ-95-1.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "QBZ-95", icon: "assets/icons/QBZ-95.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "SIG SG 550", icon: "assets/icons/SIG_SG_550.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Tavor TAR-21", icon: "assets/icons/Tavor_TAR-21.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "VHS-2", icon: "assets/icons/VHS-2.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "AS50", icon: "assets/icons/AS50.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "Accuracy International AWM", icon: "assets/icons/Accuracy_International_AWM.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Barrett M107A1", icon: "assets/icons/Barrett_M107A1.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Barrett M95", icon: "assets/icons/Barrett_M95.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "CheyTac M200 Intervention", icon: "assets/icons/CheyTac_M200_Intervention.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "Desert Tech SRS", icon: "assets/icons/Desert_Tech_SRS.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Dragunov SVD", icon: "assets/icons/Dragunov_SVD.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "FN SCAR-H SSR", icon: "assets/icons/FN_SCAR-H_SSR.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "HK G3SG1", icon: "assets/icons/HK_G3SG1.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "HK PSG-1", icon: "assets/icons/HK_PSG-1.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "KAC SR-25", icon: "assets/icons/KAC_SR-25.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "M21", icon: "assets/icons/M21.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "M240D", icon: "assets/icons/M240D.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "M240H", icon: "assets/icons/M240H.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "M249 SAW", icon: "assets/icons/M249_SAW.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "M249 SAW Para", icon: "assets/icons/M249_SAW_Para.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "M40A5", icon: "assets/icons/M40A5.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "M4A1", icon: "assets/icons/M4A1.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "M60E4", icon: "assets/icons/M60E4.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "M60E6", icon: "assets/icons/M60E6.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Mk 12 SPR", icon: "assets/icons/Mk_12_SPR.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "Mk 14 Mod 0 EBR", icon: "assets/icons/Mk_14_Mod_0_EBR.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "Mk 48 Mod 0", icon: "assets/icons/Mk_48_Mod_0.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "RPK-74", icon: "assets/icons/RPK-74.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "Remington 700", icon: "assets/icons/Remington_700.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Remington 700 VLS", icon: "assets/icons/Remington_700_VLS.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Springfield M1A", icon: "assets/icons/Springfield_M1A.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "Steyr SSG 69", icon: "assets/icons/Steyr_SSG_69.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "VSS Vintorez", icon: "assets/icons/VSS_Vintorez.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Winchester Model 70", icon: "assets/icons/Winchester_Model_70.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "AK-47", icon: "assets/icons/AK-47.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "AK-74", icon: "assets/icons/AK-74.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "AK-74M", icon: "assets/icons/AK-74M.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "AKM", icon: "assets/icons/AKM.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "AKS-74U", icon: "assets/icons/AKS-74U.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "CZ 805 BREN", icon: "assets/icons/CZ_805_BREN.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "FAMAS F1", icon: "assets/icons/FAMAS_F1.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "FAMAS G2", icon: "assets/icons/FAMAS_G2.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "FAMAS G2 1", icon: "assets/icons/FAMAS_G2_1.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "FAMAS G2 2", icon: "assets/icons/FAMAS_G2_2.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "FN F2000", icon: "assets/icons/FN_F2000.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "G36", icon: "assets/icons/G36.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "G36C", icon: "assets/icons/G36C.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "G36K", icon: "assets/icons/G36K.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "G3A3", icon: "assets/icons/G3A3.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "HK33A2", icon: "assets/icons/HK33A2.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "HK53", icon: "assets/icons/HK53.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "L85A1", icon: "assets/icons/L85A1.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "M16A1", icon: "assets/icons/M16A1.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "M16A2", icon: "assets/icons/M16A2.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "M16A2 1", icon: "assets/icons/M16A2_1.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "M16A2 M203", icon: "assets/icons/M16A2_M203.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "M4A1", icon: "assets/icons/M4A1.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "MP5SD", icon: "assets/icons/MP5SD.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "QBZ-95", icon: "assets/icons/QBZ-95.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "QBZ-95B", icon: "assets/icons/QBZ-95B.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "SIG SG550", icon: "assets/icons/SIG_SG550.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "SIG SG552", icon: "assets/icons/SIG_SG552.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Steyr AUG A1", icon: "assets/icons/Steyr_AUG_A1.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "TAR-21", icon: "assets/icons/TAR-21.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "AK-12", icon: "assets/icons/AK-12.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "AK-47 DMR", icon: "assets/icons/AK-47_DMR.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Accuracy International AW", icon: "assets/icons/Accuracy_International_AW.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "ArmaLite AR-10", icon: "assets/icons/ArmaLite_AR-10.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "Barrett M82", icon: "assets/icons/Barrett_M82.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Barrett M95", icon: "assets/icons/Barrett_M95.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "Barrett MRAD", icon: "assets/icons/Barrett_MRAD.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "DPMS LR-308", icon: "assets/icons/DPMS_LR-308.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Daniel Defense DDM4", icon: "assets/icons/Daniel_Defense_DDM4.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "Desert Tech SRS", icon: "assets/icons/Desert_Tech_SRS.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "Dragunov SVD", icon: "assets/icons/Dragunov_SVD.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "FN SCAR-H SSR", icon: "assets/icons/FN_SCAR-H_SSR.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "HK417", icon: "assets/icons/HK417.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "HK PSG-1", icon: "assets/icons/HK_PSG-1.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "IWI Negev", icon: "assets/icons/IWI_Negev.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "KAC LAMG", icon: "assets/icons/KAC_LAMG.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "LMT MWS", icon: "assets/icons/LMT_MWS.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "LaRue OBR", icon: "assets/icons/LaRue_OBR.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "M14 EBR", icon: "assets/icons/M14_EBR.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "M14 National Match", icon: "assets/icons/M14_National_Match.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "M249 SAW", icon: "assets/icons/M249_SAW.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "M60", icon: "assets/icons/M60.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "McMillan TAC-50", icon: "assets/icons/McMillan_TAC-50.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "Mk 12 SPR", icon: "assets/icons/Mk_12_SPR.png", quality: "myt", size: 4, priceRange: [200000000, 10000000000]},
    {name: "Remington 700", icon: "assets/icons/Remington_700.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "Ruger Precision Rifle", icon: "assets/icons/Ruger_Precision_Rifle.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "SIG MCX", icon: "assets/icons/SIG_MCX.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]},
    {name: "SR-25", icon: "assets/icons/SR-25.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "Sako TRG-42", icon: "assets/icons/Sako_TRG-42.png", quality: "epi", size: 4, priceRange: [200000, 3000000]},
    {name: "Winchester Model 70", icon: "assets/icons/Winchester_Model_70.png", quality: "leg", size: 4, priceRange: [8000000, 80000000]}
  ],
  // 刀刃 (64件)
  blade: [
    {name: "Ancient Styled Dagger", icon: "assets/icons/Ancient_Styled_Dagger.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Assisted Opening Tactical", icon: "assets/icons/Assisted_Opening_Tactical.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Automatic Click Folder", icon: "assets/icons/Automatic_Click_Folder.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Automatic Opener", icon: "assets/icons/Automatic_Opener.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Bloclical Knife", icon: "assets/icons/Bloclical_Knife.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Blue Steel Combat", icon: "assets/icons/Blue_Steel_Combat.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Bushcraft Knife", icon: "assets/icons/Bushcraft_Knife.png", quality: "civ", size: 2, priceRange: [100, 1000]},
    {name: "Button Lock Folder", icon: "assets/icons/Button_Lock_Folder.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Damascus Steel Blade", icon: "assets/icons/Damascus_Steel_Blade.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Damascus Steel Blade 2", icon: "assets/icons/Damascus_Steel_Blade_2.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Divers Knife", icon: "assets/icons/Divers_Knife.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Fixed Blade SF", icon: "assets/icons/Fixed_Blade_SF.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Fixed Blade SF 2", icon: "assets/icons/Fixed_Blade_SF_2.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Fixed G17 Knife", icon: "assets/icons/Fixed_G17_Knife.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Folding EDC Knife", icon: "assets/icons/Folding_EDC_Knife.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Gladius Trainer", icon: "assets/icons/Gladius_Trainer.png", quality: "civ", size: 2, priceRange: [100, 1000]},
    {name: "Hunting Fixed Blade", icon: "assets/icons/Hunting_Fixed_Blade.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Japanese Tanto", icon: "assets/icons/Japanese_Tanto.png", quality: "civ", size: 2, priceRange: [100, 1000]},
    {name: "Karambit Folder", icon: "assets/icons/Karambit_Folder.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Kukri Machete", icon: "assets/icons/Kukri_Machete.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Marine Combat Knife", icon: "assets/icons/Marine_Combat_Knife.png", quality: "civ", size: 2, priceRange: [100, 1000]},
    {name: "Pattern Welded Fixed Blade", icon: "assets/icons/Pattern_Welded_Fixed_Blade.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Slaying Fixed Blade", icon: "assets/icons/Slaying_Fixed_Blade.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Survival Machete", icon: "assets/icons/Survival_Machete.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Tactical Tanto", icon: "assets/icons/Tactical_Tanto.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Throwing Knife Set", icon: "assets/icons/Throwing_Knife_Set.png", quality: "civ", size: 2, priceRange: [100, 1000]},
    {name: "Tovin Botted Shok", icon: "assets/icons/Tovin_Botted_Shok.png", quality: "civ", size: 2, priceRange: [100, 1000]},
    {name: "Trail Master", icon: "assets/icons/Trail_Master.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Arming Sword", icon: "assets/icons/Arming_Sword.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Assyrian Short Sword", icon: "assets/icons/Assyrian_Short_Sword.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Bastard Sword", icon: "assets/icons/Bastard_Sword.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Brush Sword", icon: "assets/icons/Brush_Sword.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Claymore", icon: "assets/icons/Claymore.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "Combat Knife", icon: "assets/icons/Combat_Knife.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Cursed Katana", icon: "assets/icons/Cursed_Katana.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Custom Combat Sword", icon: "assets/icons/Custom_Combat_Sword.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Dacian Falx", icon: "assets/icons/Dacian_Falx.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Dao", icon: "assets/icons/Dao.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Excalibur", icon: "assets/icons/Excalibur.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "Falcata", icon: "assets/icons/Falcata.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Frostmourne Runeblade", icon: "assets/icons/Frostmourne_Runeblade.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Holy Avenger", icon: "assets/icons/Holy_Avenger.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Jian", icon: "assets/icons/Jian.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Katana", icon: "assets/icons/Katana.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Kukri", icon: "assets/icons/Kukri.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Longsword", icon: "assets/icons/Longsword.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "Machete", icon: "assets/icons/Machete.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Messer", icon: "assets/icons/Messer.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Multi Tool Axe", icon: "assets/icons/Multi_Tool_Axe.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Nodachi", icon: "assets/icons/Nodachi.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "Non Lethal Baton", icon: "assets/icons/Non_Lethal_Baton.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Roman Gladius", icon: "assets/icons/Roman_Gladius.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Scimitar", icon: "assets/icons/Scimitar.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Spatha", icon: "assets/icons/Spatha.png", quality: "myt", size: 3, priceRange: [200000000, 10000000000]},
    {name: "Specialized Survival Blade", icon: "assets/icons/Specialized_Survival_Blade.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Specialized Training Blade", icon: "assets/icons/Specialized_Training_Blade.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Sunblade", icon: "assets/icons/Sunblade.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Survival Blade", icon: "assets/icons/Survival_Blade.png", quality: "leg", size: 3, priceRange: [8000000, 80000000]},
    {name: "Tactical Machete", icon: "assets/icons/Tactical_Machete.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Tactical Tomahawk", icon: "assets/icons/Tactical_Tomahawk.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Vorpal Blade", icon: "assets/icons/Vorpal_Blade.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Wakizashi", icon: "assets/icons/Wakizashi.png", quality: "epi", size: 3, priceRange: [200000, 3000000]},
    {name: "Xiphos", icon: "assets/icons/Xiphos.png", quality: "rar", size: 3, priceRange: [5000, 100000]},
    {name: "Zweihander", icon: "assets/icons/Zweihander.png", quality: "rar", size: 3, priceRange: [5000, 100000]}
  ],
  // 装备 (128件)
  equip: [
    {name: "ACH Helmet MultiCam", icon: "assets/icons/ACH_Helmet_MultiCam.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "ACH Helmet NVG", icon: "assets/icons/ACH_Helmet_NVG.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "ACH Helmet Rails", icon: "assets/icons/ACH_Helmet_Rails.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "ACH Helmet Tan Rails", icon: "assets/icons/ACH_Helmet_Tan_Rails.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Advanced Plate Carrier", icon: "assets/icons/Advanced_Plate_Carrier.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Airframe Helmet", icon: "assets/icons/Airframe_Helmet.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Airframe Helmet Mandible", icon: "assets/icons/Airframe_Helmet_Mandible.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Airframe Helmet MultiCam", icon: "assets/icons/Airframe_Helmet_MultiCam.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Airframe Helmet Olive", icon: "assets/icons/Airframe_Helmet_Olive.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Airframe Helmet Visor", icon: "assets/icons/Airframe_Helmet_Visor.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Assault Pack", icon: "assets/icons/Assault_Pack.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Assault Pack Black", icon: "assets/icons/Assault_Pack_Black.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Assault Pack Large", icon: "assets/icons/Assault_Pack_Large.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Assault Pack Tan", icon: "assets/icons/Assault_Pack_Tan.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Badge Confidential Blue", icon: "assets/icons/Badge_Confidential_Blue.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Badge Secret Green", icon: "assets/icons/Badge_Secret_Green.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Badge TS SCI Red", icon: "assets/icons/Badge_TS_SCI_Red.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Ballistic Helmet Visor", icon: "assets/icons/Ballistic_Helmet_Visor.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Ballistic Riot Helmet", icon: "assets/icons/Ballistic_Riot_Helmet.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Battle Belt Vest Enhanced", icon: "assets/icons/Battle_Belt_Vest_Enhanced.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Battle Belt Vest Olive", icon: "assets/icons/Battle_Belt_Vest_Olive.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Battle Belt Vest Tan", icon: "assets/icons/Battle_Belt_Vest_Tan.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Chest Rig Vest Tan", icon: "assets/icons/Chest_Rig_Vest_Tan.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Classified Document Red", icon: "assets/icons/Classified_Document_Red.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Compact Pack", icon: "assets/icons/Compact_Pack.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Compact Pack Black", icon: "assets/icons/Compact_Pack_Black.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Compact Pack Black Plus", icon: "assets/icons/Compact_Pack_Black_Plus.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Compact Pack Plus", icon: "assets/icons/Compact_Pack_Plus.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Concealable Carrier", icon: "assets/icons/Concealable_Carrier.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Concealable Carrier Enhanced", icon: "assets/icons/Concealable_Carrier_Enhanced.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Drone Operator Vest", icon: "assets/icons/Drone_Operator_Vest.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Drone Vest Olive", icon: "assets/icons/Drone_Vest_Olive.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Drone Vest Tan", icon: "assets/icons/Drone_Vest_Tan.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "EOD Bomb Helmet", icon: "assets/icons/EOD_Bomb_Helmet.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "EOD Carrier Olive", icon: "assets/icons/EOD_Carrier_Olive.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "EOD Carrier Tan", icon: "assets/icons/EOD_Carrier_Tan.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "EOD Full Suit Complete", icon: "assets/icons/EOD_Full_Suit_Complete.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "EOD Full Suit Vest", icon: "assets/icons/EOD_Full_Suit_Vest.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "EOD Pack Heavy", icon: "assets/icons/EOD_Pack_Heavy.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "EOD Plate Carrier", icon: "assets/icons/EOD_Plate_Carrier.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "EOD Tactical Pack", icon: "assets/icons/EOD_Tactical_Pack.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Elite Ops Pack Black", icon: "assets/icons/Elite_Ops_Pack_Black.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Elite Ops Pack Tan", icon: "assets/icons/Elite_Ops_Pack_Tan.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Encrypted Hard Drive", icon: "assets/icons/Encrypted_Hard_Drive.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Enhanced Plate Carrier", icon: "assets/icons/Enhanced_Plate_Carrier.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Equipment Case Medium", icon: "assets/icons/Equipment_Case_Medium.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Equipment Case Small", icon: "assets/icons/Equipment_Case_Small.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Exoskeleton Vest", icon: "assets/icons/Exoskeleton_Vest.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Exoskeleton Vest Olive", icon: "assets/icons/Exoskeleton_Vest_Olive.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Exoskeleton Vest Tan", icon: "assets/icons/Exoskeleton_Vest_Tan.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Extended Assault Pack", icon: "assets/icons/Extended_Assault_Pack.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Extended Assault Pack Reinforced", icon: "assets/icons/Extended_Assault_Pack_Reinforced.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "FAST Helmet Ballistic", icon: "assets/icons/FAST_Helmet_Ballistic.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "FAST Helmet Ballistic Tan", icon: "assets/icons/FAST_Helmet_Ballistic_Tan.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "FAST Helmet Base", icon: "assets/icons/FAST_Helmet_Base.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "FAST Helmet Maritime", icon: "assets/icons/FAST_Helmet_Maritime.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "FAST Helmet Tan", icon: "assets/icons/FAST_Helmet_Tan.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Field Manual", icon: "assets/icons/Field_Manual.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Full Coverage Carrier", icon: "assets/icons/Full_Coverage_Carrier.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Full Protection Vest", icon: "assets/icons/Full_Protection_Vest.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Handheld Radio", icon: "assets/icons/Handheld_Radio.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Heavy Assault Pack", icon: "assets/icons/Heavy_Assault_Pack.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Heavy Assault Pack Black", icon: "assets/icons/Heavy_Assault_Pack_Black.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Heavy Ballistic Helmet", icon: "assets/icons/Heavy_Ballistic_Helmet.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Heavy Modular Vest", icon: "assets/icons/Heavy_Modular_Vest.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Heavy Plate Carrier", icon: "assets/icons/Heavy_Plate_Carrier.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Heavy Plate Carrier Olive", icon: "assets/icons/Heavy_Plate_Carrier_Olive.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Heavy Plate Carrier Tan", icon: "assets/icons/Heavy_Plate_Carrier_Tan.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "ID Card Blue Contractor", icon: "assets/icons/ID_Card_Blue_Contractor.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "ID Card Green Enlisted", icon: "assets/icons/ID_Card_Green_Enlisted.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "ID Card Red Officer", icon: "assets/icons/ID_Card_Red_Officer.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Intel Folder", icon: "assets/icons/Intel_Folder.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "JTAC Vest Enhanced", icon: "assets/icons/JTAC_Vest_Enhanced.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "JTAC Vest Radio", icon: "assets/icons/JTAC_Vest_Radio.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "LR Patrol Pack", icon: "assets/icons/LR_Patrol_Pack.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "LR Patrol Pack Black", icon: "assets/icons/LR_Patrol_Pack_Black.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Large Tactical Ruck", icon: "assets/icons/Large_Tactical_Ruck.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Large Tactical Ruck Black", icon: "assets/icons/Large_Tactical_Ruck_Black.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Light Field Pack", icon: "assets/icons/Light_Field_Pack.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Light Field Pack Tan", icon: "assets/icons/Light_Field_Pack_Tan.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Light Plate Carrier", icon: "assets/icons/Light_Plate_Carrier.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Long Range Radio", icon: "assets/icons/Long_Range_Radio.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "MICH Helmet", icon: "assets/icons/MICH_Helmet.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "MICH Helmet MultiCam", icon: "assets/icons/MICH_Helmet_MultiCam.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "MICH Helmet NVG Mount", icon: "assets/icons/MICH_Helmet_NVG_Mount.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "MICH Helmet Tan", icon: "assets/icons/MICH_Helmet_Tan.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Medic Assault Pack", icon: "assets/icons/Medic_Assault_Pack.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Medic Field Pack", icon: "assets/icons/Medic_Field_Pack.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Medic Field Pack Black", icon: "assets/icons/Medic_Field_Pack_Black.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Medic Pack Black", icon: "assets/icons/Medic_Pack_Black.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Medium Tactical Pack", icon: "assets/icons/Medium_Tactical_Pack.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Medium Tactical Pack Tan", icon: "assets/icons/Medium_Tactical_Pack_Tan.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Modular Tactical Vest", icon: "assets/icons/Modular_Tactical_Vest.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Modular Vest Enhanced", icon: "assets/icons/Modular_Vest_Enhanced.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Operator Carrier Full", icon: "assets/icons/Operator_Carrier_Full.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Operator Carrier Olive", icon: "assets/icons/Operator_Carrier_Olive.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Operator Carrier Tan", icon: "assets/icons/Operator_Carrier_Tan.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "PASGT Helmet", icon: "assets/icons/PASGT_Helmet.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "PASGT Helmet Tan", icon: "assets/icons/PASGT_Helmet_Tan.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "PASGT Helmet Woodland", icon: "assets/icons/PASGT_Helmet_Woodland.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Plate Carrier Olive", icon: "assets/icons/Plate_Carrier_Olive.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Plate Carrier Pouched", icon: "assets/icons/Plate_Carrier_Pouched.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Powered Armor Enhanced", icon: "assets/icons/Powered_Armor_Enhanced.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Powered Armor Full", icon: "assets/icons/Powered_Armor_Full.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Powered Armor Vest", icon: "assets/icons/Powered_Armor_Vest.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Recon Pack", icon: "assets/icons/Recon_Pack.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Recon Pack Expanded", icon: "assets/icons/Recon_Pack_Expanded.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Recon Pack Tan", icon: "assets/icons/Recon_Pack_Tan.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Recon Pack Tan Expanded", icon: "assets/icons/Recon_Pack_Tan_Expanded.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Riot Helmet Visor", icon: "assets/icons/Riot_Helmet_Visor.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "SIGINT Pack Black", icon: "assets/icons/SIGINT_Pack_Black.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "SIGINT Pack Tan", icon: "assets/icons/SIGINT_Pack_Tan.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "SSD Military Black", icon: "assets/icons/SSD_Military_Black.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "SSD Military Olive", icon: "assets/icons/SSD_Military_Olive.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "SSD Military Tan", icon: "assets/icons/SSD_Military_Tan.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Secure Case Large", icon: "assets/icons/Secure_Case_Large.png", quality: "rar", size: 2, priceRange: [5000, 100000]},
    {name: "Secure Smartphone", icon: "assets/icons/Secure_Smartphone.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Slick Carrier Admin", icon: "assets/icons/Slick_Carrier_Admin.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Slick Plate Carrier", icon: "assets/icons/Slick_Plate_Carrier.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Standard Field Pack", icon: "assets/icons/Standard_Field_Pack.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Standard Field Pack Alt", icon: "assets/icons/Standard_Field_Pack_Alt.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Standard Field Pack Tan", icon: "assets/icons/Standard_Field_Pack_Tan.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Standard Field Pack Tan Alt", icon: "assets/icons/Standard_Field_Pack_Tan_Alt.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Standard Plate Carrier", icon: "assets/icons/Standard_Plate_Carrier.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Tactical Tablet", icon: "assets/icons/Tactical_Tablet.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Urban Pack Reinforced", icon: "assets/icons/Urban_Pack_Reinforced.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Urban Tactical Pack", icon: "assets/icons/Urban_Tactical_Pack.png", quality: "upg", size: 2, priceRange: [500, 5000]},
    {name: "Weapons Case", icon: "assets/icons/Weapons_Case.png", quality: "upg", size: 2, priceRange: [500, 5000]}
  ],
  // 配件 (191件)
  part: [
    {name: "Gold Grip 1", icon: "assets/icons/Gold_Grip_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Grip 10", icon: "assets/icons/Gold_Grip_10.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Grip 11", icon: "assets/icons/Gold_Grip_11.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Grip 12", icon: "assets/icons/Gold_Grip_12.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Grip 13", icon: "assets/icons/Gold_Grip_13.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Grip 14", icon: "assets/icons/Gold_Grip_14.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Grip 15", icon: "assets/icons/Gold_Grip_15.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Grip 16", icon: "assets/icons/Gold_Grip_16.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Grip 2", icon: "assets/icons/Gold_Grip_2.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Grip 3", icon: "assets/icons/Gold_Grip_3.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Grip 4", icon: "assets/icons/Gold_Grip_4.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Grip 5", icon: "assets/icons/Gold_Grip_5.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Grip 6", icon: "assets/icons/Gold_Grip_6.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Grip 7", icon: "assets/icons/Gold_Grip_7.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Grip 8", icon: "assets/icons/Gold_Grip_8.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Grip 9", icon: "assets/icons/Gold_Grip_9.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Magazine 1", icon: "assets/icons/Gold_Magazine_1.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Magazine 10", icon: "assets/icons/Gold_Magazine_10.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Magazine 11", icon: "assets/icons/Gold_Magazine_11.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Magazine 12", icon: "assets/icons/Gold_Magazine_12.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Magazine 13", icon: "assets/icons/Gold_Magazine_13.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Magazine 14", icon: "assets/icons/Gold_Magazine_14.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Magazine 15", icon: "assets/icons/Gold_Magazine_15.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Magazine 16", icon: "assets/icons/Gold_Magazine_16.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Magazine 2", icon: "assets/icons/Gold_Magazine_2.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Magazine 3", icon: "assets/icons/Gold_Magazine_3.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Magazine 4", icon: "assets/icons/Gold_Magazine_4.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Magazine 5", icon: "assets/icons/Gold_Magazine_5.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Magazine 6", icon: "assets/icons/Gold_Magazine_6.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Magazine 7", icon: "assets/icons/Gold_Magazine_7.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Magazine 8", icon: "assets/icons/Gold_Magazine_8.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Magazine 9", icon: "assets/icons/Gold_Magazine_9.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Reflex Sight 1", icon: "assets/icons/Gold_Reflex_Sight_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Reflex Sight 10", icon: "assets/icons/Gold_Reflex_Sight_10.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Reflex Sight 11", icon: "assets/icons/Gold_Reflex_Sight_11.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Reflex Sight 12", icon: "assets/icons/Gold_Reflex_Sight_12.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Reflex Sight 13", icon: "assets/icons/Gold_Reflex_Sight_13.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Reflex Sight 14", icon: "assets/icons/Gold_Reflex_Sight_14.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Reflex Sight 15", icon: "assets/icons/Gold_Reflex_Sight_15.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Reflex Sight 16", icon: "assets/icons/Gold_Reflex_Sight_16.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Reflex Sight 2", icon: "assets/icons/Gold_Reflex_Sight_2.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Reflex Sight 3", icon: "assets/icons/Gold_Reflex_Sight_3.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Reflex Sight 4", icon: "assets/icons/Gold_Reflex_Sight_4.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Reflex Sight 5", icon: "assets/icons/Gold_Reflex_Sight_5.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Reflex Sight 6", icon: "assets/icons/Gold_Reflex_Sight_6.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Reflex Sight 7", icon: "assets/icons/Gold_Reflex_Sight_7.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Reflex Sight 8", icon: "assets/icons/Gold_Reflex_Sight_8.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Reflex Sight 9", icon: "assets/icons/Gold_Reflex_Sight_9.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Scope 1", icon: "assets/icons/Gold_Scope_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Scope 10", icon: "assets/icons/Gold_Scope_10.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Scope 11", icon: "assets/icons/Gold_Scope_11.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Scope 12", icon: "assets/icons/Gold_Scope_12.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Scope 13", icon: "assets/icons/Gold_Scope_13.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Scope 14", icon: "assets/icons/Gold_Scope_14.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Scope 15", icon: "assets/icons/Gold_Scope_15.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Scope 16", icon: "assets/icons/Gold_Scope_16.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Scope 2", icon: "assets/icons/Gold_Scope_2.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Scope 3", icon: "assets/icons/Gold_Scope_3.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Scope 4", icon: "assets/icons/Gold_Scope_4.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Scope 5", icon: "assets/icons/Gold_Scope_5.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Scope 6", icon: "assets/icons/Gold_Scope_6.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Scope 7", icon: "assets/icons/Gold_Scope_7.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Scope 8", icon: "assets/icons/Gold_Scope_8.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Scope 9", icon: "assets/icons/Gold_Scope_9.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Suppressor 1", icon: "assets/icons/Gold_Suppressor_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Suppressor 10", icon: "assets/icons/Gold_Suppressor_10.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Suppressor 11", icon: "assets/icons/Gold_Suppressor_11.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Suppressor 12", icon: "assets/icons/Gold_Suppressor_12.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Suppressor 13", icon: "assets/icons/Gold_Suppressor_13.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Suppressor 14", icon: "assets/icons/Gold_Suppressor_14.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Suppressor 15", icon: "assets/icons/Gold_Suppressor_15.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Suppressor 16", icon: "assets/icons/Gold_Suppressor_16.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Suppressor 2", icon: "assets/icons/Gold_Suppressor_2.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Suppressor 3", icon: "assets/icons/Gold_Suppressor_3.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Suppressor 4", icon: "assets/icons/Gold_Suppressor_4.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Suppressor 5", icon: "assets/icons/Gold_Suppressor_5.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Suppressor 6", icon: "assets/icons/Gold_Suppressor_6.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Suppressor 7", icon: "assets/icons/Gold_Suppressor_7.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Suppressor 8", icon: "assets/icons/Gold_Suppressor_8.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Suppressor 9", icon: "assets/icons/Gold_Suppressor_9.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Tactical Light 1", icon: "assets/icons/Gold_Tactical_Light_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Tactical Light 10", icon: "assets/icons/Gold_Tactical_Light_10.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Tactical Light 11", icon: "assets/icons/Gold_Tactical_Light_11.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Tactical Light 12", icon: "assets/icons/Gold_Tactical_Light_12.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Tactical Light 13", icon: "assets/icons/Gold_Tactical_Light_13.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Tactical Light 14", icon: "assets/icons/Gold_Tactical_Light_14.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Tactical Light 15", icon: "assets/icons/Gold_Tactical_Light_15.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Tactical Light 16", icon: "assets/icons/Gold_Tactical_Light_16.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Tactical Light 2", icon: "assets/icons/Gold_Tactical_Light_2.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Tactical Light 3", icon: "assets/icons/Gold_Tactical_Light_3.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Tactical Light 4", icon: "assets/icons/Gold_Tactical_Light_4.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Tactical Light 5", icon: "assets/icons/Gold_Tactical_Light_5.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Tactical Light 6", icon: "assets/icons/Gold_Tactical_Light_6.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Gold Tactical Light 7", icon: "assets/icons/Gold_Tactical_Light_7.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Gold Tactical Light 8", icon: "assets/icons/Gold_Tactical_Light_8.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Gold Tactical Light 9", icon: "assets/icons/Gold_Tactical_Light_9.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Grip 1", icon: "assets/icons/Silver_Grip_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Grip 10", icon: "assets/icons/Silver_Grip_10.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Grip 11", icon: "assets/icons/Silver_Grip_11.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Grip 12", icon: "assets/icons/Silver_Grip_12.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Grip 13", icon: "assets/icons/Silver_Grip_13.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Grip 14", icon: "assets/icons/Silver_Grip_14.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Grip 15", icon: "assets/icons/Silver_Grip_15.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Grip 16", icon: "assets/icons/Silver_Grip_16.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Grip 2", icon: "assets/icons/Silver_Grip_2.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Grip 3", icon: "assets/icons/Silver_Grip_3.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Grip 4", icon: "assets/icons/Silver_Grip_4.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Grip 5", icon: "assets/icons/Silver_Grip_5.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Grip 7", icon: "assets/icons/Silver_Grip_7.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Grip 8", icon: "assets/icons/Silver_Grip_8.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Grip 9", icon: "assets/icons/Silver_Grip_9.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Magazine 1", icon: "assets/icons/Silver_Magazine_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Magazine 10", icon: "assets/icons/Silver_Magazine_10.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Magazine 11", icon: "assets/icons/Silver_Magazine_11.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Magazine 12", icon: "assets/icons/Silver_Magazine_12.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Magazine 13", icon: "assets/icons/Silver_Magazine_13.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Magazine 14", icon: "assets/icons/Silver_Magazine_14.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Magazine 15", icon: "assets/icons/Silver_Magazine_15.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Magazine 16", icon: "assets/icons/Silver_Magazine_16.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Magazine 2", icon: "assets/icons/Silver_Magazine_2.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Magazine 3", icon: "assets/icons/Silver_Magazine_3.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Magazine 4", icon: "assets/icons/Silver_Magazine_4.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Magazine 5", icon: "assets/icons/Silver_Magazine_5.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Magazine 6", icon: "assets/icons/Silver_Magazine_6.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Magazine 7", icon: "assets/icons/Silver_Magazine_7.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Magazine 8", icon: "assets/icons/Silver_Magazine_8.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Magazine 9", icon: "assets/icons/Silver_Magazine_9.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Reflex Sight 1", icon: "assets/icons/Silver_Reflex_Sight_1.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Reflex Sight 10", icon: "assets/icons/Silver_Reflex_Sight_10.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Reflex Sight 11", icon: "assets/icons/Silver_Reflex_Sight_11.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Reflex Sight 12", icon: "assets/icons/Silver_Reflex_Sight_12.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Reflex Sight 13", icon: "assets/icons/Silver_Reflex_Sight_13.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Reflex Sight 14", icon: "assets/icons/Silver_Reflex_Sight_14.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Reflex Sight 15", icon: "assets/icons/Silver_Reflex_Sight_15.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Reflex Sight 16", icon: "assets/icons/Silver_Reflex_Sight_16.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Reflex Sight 2", icon: "assets/icons/Silver_Reflex_Sight_2.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Reflex Sight 3", icon: "assets/icons/Silver_Reflex_Sight_3.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Reflex Sight 4", icon: "assets/icons/Silver_Reflex_Sight_4.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Reflex Sight 5", icon: "assets/icons/Silver_Reflex_Sight_5.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Reflex Sight 6", icon: "assets/icons/Silver_Reflex_Sight_6.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Reflex Sight 7", icon: "assets/icons/Silver_Reflex_Sight_7.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Reflex Sight 8", icon: "assets/icons/Silver_Reflex_Sight_8.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Reflex Sight 9", icon: "assets/icons/Silver_Reflex_Sight_9.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Scope 1", icon: "assets/icons/Silver_Scope_1.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Scope 10", icon: "assets/icons/Silver_Scope_10.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Scope 11", icon: "assets/icons/Silver_Scope_11.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Scope 12", icon: "assets/icons/Silver_Scope_12.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Scope 13", icon: "assets/icons/Silver_Scope_13.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Scope 14", icon: "assets/icons/Silver_Scope_14.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Scope 15", icon: "assets/icons/Silver_Scope_15.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Scope 16", icon: "assets/icons/Silver_Scope_16.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Scope 2", icon: "assets/icons/Silver_Scope_2.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Scope 3", icon: "assets/icons/Silver_Scope_3.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Scope 4", icon: "assets/icons/Silver_Scope_4.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Scope 5", icon: "assets/icons/Silver_Scope_5.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Scope 6", icon: "assets/icons/Silver_Scope_6.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Scope 7", icon: "assets/icons/Silver_Scope_7.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Scope 8", icon: "assets/icons/Silver_Scope_8.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Scope 9", icon: "assets/icons/Silver_Scope_9.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Suppressor 1", icon: "assets/icons/Silver_Suppressor_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Suppressor 10", icon: "assets/icons/Silver_Suppressor_10.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Suppressor 11", icon: "assets/icons/Silver_Suppressor_11.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Suppressor 12", icon: "assets/icons/Silver_Suppressor_12.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Suppressor 13", icon: "assets/icons/Silver_Suppressor_13.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Suppressor 14", icon: "assets/icons/Silver_Suppressor_14.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Suppressor 15", icon: "assets/icons/Silver_Suppressor_15.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Suppressor 16", icon: "assets/icons/Silver_Suppressor_16.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Suppressor 2", icon: "assets/icons/Silver_Suppressor_2.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Suppressor 3", icon: "assets/icons/Silver_Suppressor_3.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Suppressor 4", icon: "assets/icons/Silver_Suppressor_4.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Suppressor 5", icon: "assets/icons/Silver_Suppressor_5.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Suppressor 6", icon: "assets/icons/Silver_Suppressor_6.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Suppressor 7", icon: "assets/icons/Silver_Suppressor_7.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Suppressor 8", icon: "assets/icons/Silver_Suppressor_8.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Suppressor 9", icon: "assets/icons/Silver_Suppressor_9.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 1", icon: "assets/icons/Silver_Tactical_Light_1.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 10", icon: "assets/icons/Silver_Tactical_Light_10.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 11", icon: "assets/icons/Silver_Tactical_Light_11.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 12", icon: "assets/icons/Silver_Tactical_Light_12.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Silver Tactical Light 13", icon: "assets/icons/Silver_Tactical_Light_13.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Tactical Light 14", icon: "assets/icons/Silver_Tactical_Light_14.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 15", icon: "assets/icons/Silver_Tactical_Light_15.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Tactical Light 16", icon: "assets/icons/Silver_Tactical_Light_16.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Silver Tactical Light 2", icon: "assets/icons/Silver_Tactical_Light_2.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 3", icon: "assets/icons/Silver_Tactical_Light_3.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 4", icon: "assets/icons/Silver_Tactical_Light_4.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 5", icon: "assets/icons/Silver_Tactical_Light_5.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 6", icon: "assets/icons/Silver_Tactical_Light_6.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 7", icon: "assets/icons/Silver_Tactical_Light_7.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 8", icon: "assets/icons/Silver_Tactical_Light_8.png", quality: "civ", size: 1, priceRange: [100, 1000]},
    {name: "Silver Tactical Light 9", icon: "assets/icons/Silver_Tactical_Light_9.png", quality: "rar", size: 1, priceRange: [5000, 100000]}
  ],
  // 特殊物品 (50件)
  special: [
    {name: "Ancient Coins", icon: "assets/icons/Ancient_Coins.png", quality: "epi", size: 1, priceRange: [200000, 3000000]},
    {name: "BLUE Labs Card", icon: "assets/icons/BLUE_Labs_Card.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Battery Packs", icon: "assets/icons/Battery_Packs.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Battery Unit", icon: "assets/icons/Battery_Unit.png", quality: "leg", size: 1, priceRange: [8000000, 80000000]},
    {name: "Binoculars Case", icon: "assets/icons/Binoculars_Case.png", quality: "epi", size: 1, priceRange: [200000, 3000000]},
    {name: "CPU Module", icon: "assets/icons/CPU_Module.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Equipment Case", icon: "assets/icons/Equipment_Case.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Field Radio", icon: "assets/icons/Field_Radio.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Flashlight Set", icon: "assets/icons/Flashlight_Set.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "GRAY Labs Cards", icon: "assets/icons/GRAY_Labs_Cards.png", quality: "leg", size: 1, priceRange: [8000000, 80000000]},
    {name: "GREEN Access Card", icon: "assets/icons/GREEN_Access_Card.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Golden Warrior", icon: "assets/icons/Golden_Warrior.png", quality: "epi", size: 1, priceRange: [200000, 3000000]},
    {name: "Gun Cleaning Kit", icon: "assets/icons/Gun_Cleaning_Kit.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Heavy Container", icon: "assets/icons/Heavy_Container.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Jade Dragon Seal", icon: "assets/icons/Jade_Dragon_Seal.png", quality: "leg", size: 1, priceRange: [8000000, 80000000]},
    {name: "Jewelry Set", icon: "assets/icons/Jewelry_Set.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Leather Portfolio", icon: "assets/icons/Leather_Portfolio.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Ornate Dagger", icon: "assets/icons/Ornate_Dagger.png", quality: "epi", size: 1, priceRange: [200000, 3000000]},
    {name: "Pottery Shard", icon: "assets/icons/Pottery_Shard.png", quality: "leg", size: 1, priceRange: [8000000, 80000000]},
    {name: "RED Access Card", icon: "assets/icons/RED_Access_Card.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Rugged Laptop", icon: "assets/icons/Rugged_Laptop.png", quality: "epi", size: 1, priceRange: [200000, 3000000]},
    {name: "Satellite Dish", icon: "assets/icons/Satellite_Dish.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Scroll Cases", icon: "assets/icons/Scroll_Cases.png", quality: "rar", size: 1, priceRange: [5000, 100000]},
    {name: "Secure Case", icon: "assets/icons/Secure_Case.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Tactical Tablet", icon: "assets/icons/Tactical_Tablet.png", quality: "upg", size: 1, priceRange: [500, 5000]},
    {name: "Weapon Parts", icon: "assets/icons/Weapon_Parts.png", quality: "epi", size: 1, priceRange: [200000, 3000000]},
    {name: "Ancient Books", icon: "assets/icons/Ancient_Books.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Canopic Jar", icon: "assets/icons/Canopic_Jar.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Crown", icon: "assets/icons/Crown.png", quality: "myt", size: 2, priceRange: [200000000, 10000000000]},
    {name: "Cryo Safe", icon: "assets/icons/Cryo_Safe.png", quality: "myt", size: 2, priceRange: [200000000, 10000000000]},
    {name: "Diamond Ring Box", icon: "assets/icons/Diamond_Ring_Box.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Encrypted Drive", icon: "assets/icons/Encrypted_Drive.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Energy Cell", icon: "assets/icons/Energy_Cell.png", quality: "myt", size: 2, priceRange: [200000000, 10000000000]},
    {name: "Energy Core", icon: "assets/icons/Energy_Core.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Fingerprint Card Set", icon: "assets/icons/Fingerprint_Card_Set.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Fingerprint Scanner", icon: "assets/icons/Fingerprint_Scanner.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Ivory Horn", icon: "assets/icons/Ivory_Horn.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Meteorite", icon: "assets/icons/Meteorite.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Open Ancient Book", icon: "assets/icons/Open_Ancient_Book.png", quality: "myt", size: 2, priceRange: [200000000, 10000000000]},
    {name: "Organ Tray", icon: "assets/icons/Organ_Tray.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Pocket Watch", icon: "assets/icons/Pocket_Watch.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Retro Phone Blue", icon: "assets/icons/Retro_Phone_Blue.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Retro Phone Brown", icon: "assets/icons/Retro_Phone_Brown.png", quality: "myt", size: 2, priceRange: [200000000, 10000000000]},
    {name: "Retro Phone Gold", icon: "assets/icons/Retro_Phone_Gold.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Retro Phone Gray", icon: "assets/icons/Retro_Phone_Gray.png", quality: "myt", size: 2, priceRange: [200000000, 10000000000]},
    {name: "Retro Phone Red", icon: "assets/icons/Retro_Phone_Red.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Robotic Arm", icon: "assets/icons/Robotic_Arm.png", quality: "leg", size: 2, priceRange: [8000000, 80000000]},
    {name: "Sapphire Set Box", icon: "assets/icons/Sapphire_Set_Box.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Security Briefcase", icon: "assets/icons/Security_Briefcase.png", quality: "epi", size: 2, priceRange: [200000, 3000000]},
    {name: "Star Chart Case", icon: "assets/icons/Star_Chart_Case.png", quality: "myt", size: 2, priceRange: [200000000, 10000000000]}
  ]
};

const SKILLS = [
  {key:'lootRate',name:'出货率',desc:'提高高品质物品出现概率',maxLevel:999,costBase:200,icon:'💎',
   effect(lv){return '+'+((1-Math.pow(0.995,lv))*100).toFixed(1)+'%';},
   effectDesc(lv){return '高品质概率+'+((1-Math.pow(0.995,lv))*100).toFixed(1)+'%';}},
  {key:'appraiseEye',name:'鉴定术',desc:'降低鉴定出现赝品的概率',maxLevel:999,costBase:150,icon:'🔍',
   effect(lv){return '-'+(Math.min(lv*0.1,95)).toFixed(1)+'%赝品';},
   effectDesc(lv){return '赝品概率-'+(Math.min(lv*0.1,95)).toFixed(1)+'%';}},
  {key:'durability',name:'抗破损',desc:'探索时物品更不容易损坏',maxLevel:999,costBase:200,icon:'🛡️',
   effect(lv){return Math.min(lv*0.1,95).toFixed(1)+'%';},
   effectDesc(lv){return '完好率'+Math.min(lv*0.1,95).toFixed(1)+'%';}},
  {key:'stamina',name:'体力',desc:'增加最大体力值',maxLevel:999,costBase:600,icon:'⚡',
   effect(lv){return 100+(lv-1)*2+'上限';},
   effectDesc(lv){return '体力上限'+(100+(lv-1)*2);}},
  {key:'repair',name:'修补',desc:'降低修复费用',maxLevel:999,costBase:100,icon:'🔧',
   effect(lv){return '-'+Math.min(lv*0.1,90).toFixed(1)+'%';},
   effectDesc(lv){return '修复费用-'+Math.min(lv*0.1,90).toFixed(1)+'%';}},
  {key:'negotiation',name:'谈判',desc:'提高出售价格',maxLevel:999,costBase:100,icon:'💰',
   effect(lv){return '+'+Math.min(lv*0.1,200).toFixed(1)+'%';},
   effectDesc(lv){return '售价+'+Math.min(lv*0.1,200).toFixed(1)+'%';}}
];
const QUALITY_CONFIG = {
  civ:{label:'CIV',name:'普通',color:'#9CA3AF',weight:50,sfx:'reveal',order:0},
  upg:{label:'UPG',name:'改良',color:'#4CAF50',weight:30,sfx:'reveal',order:1},
  rar:{label:'RAR',name:'精良',color:'#3B82F6',weight:12,sfx:'rare',order:2},
  epi:{label:'EPI',name:'史诗',color:'#8B5CF6',weight:5,sfx:'epic',order:3},
  leg:{label:'LEG',name:'传说',color:'#FFD700',weight:2,sfx:'legend',order:4},
  myt:{label:'MYT',name:'神话',color:'#EF4444',weight:1,sfx:'mythic',order:5}
};
const QUALITY_ORDER = ['civ','upg','rar','epi','leg','myt'];
const EVENTS = [
  {id:'crate',name:'补给箱',icon:'📦',iconClass:'event-modal__icon--crate',desc:'发现了一个补给箱！里面可能有好东西。',action:'打开补给箱',
    execute(){const d=GameData.data,z=ZONES[d.maps.currentMap],q=randomQuality(z.qualityRange),item=randomItem(q);if(item){d.inventory.push(item);d.stats.totalLooted++;return{type:'item',item,message:`获得了 ${item.name}！`};}return{type:'gold',amount:randomInt(1000,5000),message:'里面只有一些弹壳...'};}},
  {id:'trap',name:'陷阱！',icon:'💣',iconClass:'event-modal__icon--trap',desc:'小心！这是一个陷阱！可能损失金币和体力，但也有小概率获得稀有物品。',action:'拆除陷阱',
    execute(){const d=GameData.data;if(Math.random()<0.7){const gl=Math.floor(d.player.gold*0.05),sl=randomInt(3,8);d.player.gold=Math.max(0,d.player.gold-gl);d.player.stamina=Math.max(0,d.player.stamina-sl);return{type:'loss',gold:gl,stamina:sl,message:`陷阱触发！-💰${formatGold(gl)} -⚡${sl}`};}const q=randomQuality(['rar','epi','leg','myt']),item=randomItem(q);if(item){d.inventory.push(item);d.stats.totalLooted++;return{type:'item',item,message:`成功拆除！发现了 ${item.name}！`};}return{type:'gold',amount:0,message:'什么都没有...'};}},
  {id:'signal',name:'信号干扰',icon:'📡',iconClass:'event-modal__icon--signal',desc:'检测到不明信号源。可能是敌方通讯，也可能是隐藏补给。',action:'追踪信号',
    execute(){const d=GameData.data;if(Math.random()<0.5){const gl=Math.floor(d.player.gold*0.03);d.player.gold=Math.max(0,d.player.gold-gl);return{type:'loss',gold:gl,stamina:0,message:`信号是敌方诱饵！-💰${formatGold(gl)}`};}const gg=randomInt(500,3000)*(d.maps.currentMap+1);d.player.gold+=gg;return{type:'gold',amount:gg,message:`截获敌方物资！+💰${formatGold(gg)}`};}},
  {id:'airdrop',name:'空投补给',icon:'✈️',iconClass:'event-modal__icon--airdrop',desc:'友军空投补给到了！必定获得奖励。',action:'领取补给',
    execute(){const d=GameData.data,z=ZONES[d.maps.currentMap],cnt=randomInt(1,3),items=[];for(let i=0;i<cnt;i++){const q=randomQuality(z.qualityRange),item=randomItem(q);if(item){d.inventory.push(item);d.stats.totalLooted++;items.push(item);}}const gg=randomInt(200,2000)*(d.maps.currentMap+1);d.player.gold+=gg;return{type:'airdrop',items,gold:gg,message:`获得${cnt}件物品 +💰${formatGold(gg)}`};}},
  {id:'merchant',name:'神秘商人',icon:'🎭',iconClass:'event-modal__icon--merchant',desc:'一个神秘商人出现了，他愿意免费送你一件礼物。',action:'收下礼物',
    execute(){const d=GameData.data,z=ZONES[d.maps.currentMap],bq=z.qualityRange[z.qualityRange.length-1],item=randomItem(bq);if(item){d.inventory.push(item);d.stats.totalLooted++;return{type:'item',item,message:`商人送了你 ${item.name}！`};}return{type:'gold',amount:randomInt(1000,10000),message:'商人给了你一些金币'};}}
];

// ========== 工具函数 ==========
function generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2,5);}
function randomInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function formatGold(n){if(n>=100000000)return(n/100000000).toFixed(1)+'亿';if(n>=10000)return(n/10000).toFixed(1)+'万';return n.toLocaleString();}
function iconHtml(icon,size,quality){if(!size)size=24;if(!icon||typeof icon!=='string')return'📦';if(icon.startsWith('assets/')){const glow={civ:'',upg:'drop-shadow(0 0 3px #4CAF50)',rar:'drop-shadow(0 0 4px #3B82F6)',epi:'drop-shadow(0 0 5px #8B5CF6)',leg:'drop-shadow(0 0 6px #FFD700)',myt:'drop-shadow(0 0 8px #EF4444)'};const filter=quality&&glow[quality]?'filter:'+glow[quality]+';':'filter:brightness(1.2);';return`<img src="${icon}" style="width:${size}px;height:${size}px;object-fit:contain;${filter}" onerror="this.outerHTML='📦'">`;}return icon;}
function itemIconSize(itemSize,base){if(!itemSize)itemSize=1;base=base||24;return base+(itemSize-1)*12;}
function randomQuality(range){const a=range||['civ','upg','rar','epi','leg','myt'];const d=GameData.data;const lootBonus=d.skills.lootRate||1;const lootMult=1+Math.pow(0.995,lootBonus)*2;const w=a.map(q=>{const base=QUALITY_CONFIG[q].weight;const order=QUALITY_CONFIG[q].order;if(order>=3)return Math.floor(base*lootMult);if(order>=2)return Math.floor(base*Math.sqrt(lootMult));return base;});const t=w.reduce((x,y)=>x+y,0);let r=Math.random()*t;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i];}return a[a.length-1];}
function randomItem(quality){const all=[];for(const c in ITEMS_DB)ITEMS_DB[c].forEach(i=>{if(i.quality===quality)all.push({...i,category:c});});if(!all.length)return null;const item=all[randomInt(0,all.length-1)],basePrice=randomInt(item.priceRange[0],item.priceRange[1]);const d=GameData.data,durLv=d.skills.durability||1,dmgChance=Math.max(0.02,0.3*Math.pow(0.99,durLv));return{id:generateId(),name:item.name,icon:item.icon,category:item.category,quality:item.quality,size:item.size,basePrice:basePrice,price:basePrice,damaged:Math.random()<dmgChance,durability:Math.random()<dmgChance?randomInt(30,80):100,appraised:false,appraiseLevel:0,story:''};}

// ========== 背包状态管理 ==========
const BackpackState = {
  filter: 'all',       // 当前分类筛选
  sort: 'quality-desc',     // 当前排序方式（默认按品质降序）
  multiSelect: false,  // 是否多选模式
  selectedIds: new Set(), // 多选的物品ID

  // 获取筛选+排序后的物品列表
  getFilteredItems() {
    let items = [...GameData.data.inventory];

    // 分类筛选
    if (this.filter !== 'all') {
      items = items.filter(i => i.category === this.filter);
    }

    // 排序
    switch(this.sort) {
      case 'quality-desc': items.sort((a,b) => QUALITY_CONFIG[b.quality].order - QUALITY_CONFIG[a.quality].order); break;
      case 'quality-asc': items.sort((a,b) => QUALITY_CONFIG[a.quality].order - QUALITY_CONFIG[b.quality].order); break;
      case 'price-desc': items.sort((a,b) => b.price - a.price); break;
      case 'price-asc': items.sort((a,b) => a.price - b.price); break;
      case 'damaged': items = items.filter(i => i.damaged); break;
      case 'unappraised': items = items.filter(i => !i.appraised); break;
    }

    return items;
  },

  // 获取各分类数量
  getCounts() {
    const inv = GameData.data.inventory;
    return {
      all: inv.length,
      gun: inv.filter(i=>i.category==='gun').length,
      blade: inv.filter(i=>i.category==='blade').length,
      equip: inv.filter(i=>i.category==='equip').length,
      part: inv.filter(i=>i.category==='part').length,
      special: inv.filter(i=>i.category==='special').length
    };
  },

  // 切换多选
  toggleSelect(itemId) {
    if (this.selectedIds.has(itemId)) this.selectedIds.delete(itemId);
    else this.selectedIds.add(itemId);
  },

  // 全选当前筛选的物品
  selectAll() {
    const items = this.getFilteredItems();
    items.forEach(i => this.selectedIds.add(i.id));
  },

  // 清除选择
  clearSelection() {
    this.selectedIds.clear();
    this.multiSelect = false;
  },

  // 获取选中物品
  getSelectedItems() {
    return GameData.data.inventory.filter(i => this.selectedIds.has(i.id));
  }
};

// ========== 探索背包等级配置 ==========
const DIG_BACKPACK_LEVELS = [
  { level:1, name:'小挎包', slots:20, upgradeCost:0 },
  { level:2, name:'帆布包', slots:30, upgradeCost:1000 },
  { level:3, name:'战术背包', slots:45, upgradeCost:8000 },
  { level:4, name:'军用背包', slots:60, upgradeCost:50000 },
  { level:5, name:'探险背包', slots:80, upgradeCost:300000 }
];

// ========== 探索引擎 ==========
const DigEngine = {
  session:{items:[],events:[],staminaUsed:0,isEmpty:false},
  resetSession(){this.session.events=[];this.session.staminaUsed=0;this.session.isEmpty=false;},
  // 探索背包物品持久化，指向 GameData.data.digItems
  get items(){return GameData.data.digItems;},
  digCell(){
    const d=GameData.data;
    if(d.player.stamina<1)return null;
    const zone=ZONES[d.maps.currentMap];
    const bpConf=DIG_BACKPACK_LEVELS[GameData.data.digBackpack.level-1]||DIG_BACKPACK_LEVELS[0];
    let usedSlots=0;GameData.data.digItems.forEach(it=>{const s=UI._getItemSpan(it.size,it.category,it.icon);usedSlots+=s.w*s.h;});
    if(usedSlots>=bpConf.slots){UI.showToast('探索背包已满！请放入仓库');return null;}
    SFX.init();SFX.play('dig');
    d.player.stamina=Math.max(0,d.player.stamina-1);
    this.session.staminaUsed++;
    const isEvent=Math.random()<zone.eventChance;
    const isEmpty=!isEvent&&Math.random()<0.25;

    if(isEmpty){
      SFX.play('empty');
      return{isEmpty:true};
    }
    if(isEvent){
      SFX.play('event');
      const ev=EVENTS[randomInt(0,EVENTS.length-1)];
      this.session.events.push({event:ev});
      setTimeout(()=>UI.showEventModal(ev),300);
      return{isEvent:true};
    }

    const q=randomQuality(zone.qualityRange);
    const item=randomItem(q);
    if(item){
      GameData.data.digItems.push(item);
      SFX.play(QUALITY_CONFIG[q].sfx);
      d.player.exp+=q==='civ'?1:q==='upg'?3:q==='rar'?8:q==='epi'?20:q==='leg'?50:100;
      this.checkLevelUp();
      UI.updateDigBackpack();
      GameData.save();
      UI.updateStatusBar();
      return{item};
    }
    return null;
  },
  digTen(){
    const d=GameData.data;
    if(d.player.stamina<10)return;
    const bpConf=DIG_BACKPACK_LEVELS[(d.digBackpack||{level:1}).level-1]||DIG_BACKPACK_LEVELS[0];
    let usedSlots=0;(d.digItems||[]).forEach(it=>{const s=UI._getItemSpan(it.size,it.category,it.icon);usedSlots+=s.w*s.h;});
    if(usedSlots>=bpConf.slots){UI.showToast('探索背包已满！');return;}
    this.resetSession();
    const cnt=Math.min(10,d.player.stamina);
    if(!cnt)return;
    for(let i=0;i<cnt;i++){
      setTimeout(()=>{
        this.digCell();
        if(i===cnt-1){
          setTimeout(()=>{
            if(d.digItems.length>0)UI.showResultModal();
          },500);
        }
      },i*150);
    }
  },
  checkLevelUp(){const d=GameData.data,need=d.player.level*100;while(d.player.exp>=need){d.player.exp-=need;d.player.level++;UI.showToast('🎉 升级到 Lv.'+d.player.level+'！');}},
  getProgress(){const t=document.querySelectorAll('.dig-cell').length,r=document.querySelectorAll('.dig-cell--revealed,.dig-cell--empty,.dig-cell--event').length;return{revealed:r,total:t,percent:t>0?Math.round(r/t*100):0};}
};

// ========== 体力系统 ==========
const StaminaSystem = {
  RECOVERY_INTERVAL:60000,timerInterval:null,
  startTimer(){if(this.timerInterval)clearInterval(this.timerInterval);this.timerInterval=setInterval(()=>this.recover(),1000);this.updateDisplay();},
  recover(){const d=GameData.data;if(d.player.stamina>=d.player.maxStamina){this.updateDisplay();return;}const now=Date.now(),last=d.staminaRecovery.lastRecoveryTime||now,elapsed=now-last;if(elapsed>=this.RECOVERY_INTERVAL){const pts=Math.min(Math.floor(elapsed/this.RECOVERY_INTERVAL),d.player.maxStamina-d.player.stamina);d.player.stamina+=pts;d.staminaRecovery.lastRecoveryTime=now;GameData.save();UI.updateStatusBar();}this.updateDisplay();},
  updateDisplay(){const d=GameData.data,tip=document.getElementById('staminaTip'),timer=document.getElementById('staminaTimer');if(!tip||!timer)return;if(d.player.stamina>=d.player.maxStamina){tip.style.display='none';return;}tip.style.display='flex';const now=Date.now(),last=d.staminaRecovery.lastRecoveryTime||now,rem=Math.max(0,this.RECOVERY_INTERVAL-(now-last)),s=Math.ceil(rem/1000);timer.textContent=`${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;},
  recoverByAd(){const d=GameData.data;if(d.ads.staminaToday>=20){UI.showToast('今日广告次数已用完');return false;}d.player.stamina=Math.min(d.player.maxStamina,d.player.stamina+50);d.ads.staminaToday++;d.staminaRecovery.lastRecoveryTime=Date.now();GameData.save();UI.updateStatusBar();SFX.play('success');UI.showToast('体力+50！');return true;}
};

// ========== P4: 交易所引擎 ==========
const MarketEngine = {
  items: [],              // 当前在售商品列表
  refreshInterval: 180000, // 3分钟刷新一次
  timerInterval: null,     // 计时器引用
  lastRefresh: Date.now(), // 上次刷新时间
  globalFluct: 1.0,        // 全局行情倍率（仅交易页面生效）

  // 刷新行情波动（每个物品单独随机）
  refreshFluct() {
    const d = GameData.data;
    d.inventory.forEach(item => {
      item._marketFluct = +(0.8 + Math.random() * 0.7).toFixed(2); // 0.8~1.5
    });
  },

  // 刷新商品：从 ITEMS_DB 随机生成6件商品
  refresh() {
    this.refreshFluct();
    this.items = [];
    this.lastRefresh = Date.now();
    const allItems = [];
    // 收集所有物品模板
    for (const cat in ITEMS_DB) {
      ITEMS_DB[cat].forEach(t => allItems.push({...t, category: cat}));
    }
    // 随机选6件不重复的
    const shuffled = allItems.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(6, shuffled.length); i++) {
      const template = shuffled[i];
      const basePrice = randomInt(template.priceRange[0], template.priceRange[1]);
      const multiplier = 0.95 + Math.random() * 0.35; // 0.95~1.3x
      this.items.push({
        id: generateId(),
        name: template.name,
        icon: template.icon,
        category: template.category,
        quality: template.quality,
        size: template.size,
        price: Math.floor(basePrice * multiplier),
        basePrice: basePrice,
        multiplier: multiplier
      });
    }
    // 同时刷新收藏家
    CollectorNPC.refresh();
    // 刷新商店
    ShopSystem.refresh();
  },

  // 启动倒计时
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      const remaining = this.getTimeRemaining();
      const timerEl = document.getElementById('marketTimer');
      if (timerEl) {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
      }
      // 自动刷新
      if (remaining <= 0) {
        this.refresh();
        if (Game.currentTab === 'market') UI.refreshMarket();
      }
    }, 1000);
  },

  // 购买商品
  buyItem(index) {
    const d = GameData.data;
    const item = this.items[index];
    if (!item) return;
    if (d.player.gold < item.price) {
      UI.showToast('金币不足！');
      return;
    }
    // 仓库无限大，不需要检查空间
    // 扣钱、加入背包
    d.player.gold -= item.price;
    const newItem = {
      id: generateId(),
      name: item.name,
      icon: item.icon,
      category: item.category,
      quality: item.quality,
      size: item.size,
      price: item.basePrice,
      damaged: false,
      durability: 100,
      appraised: false,
      appraiseLevel: 0,
      story: ''
    };
    d.inventory.push(newItem);
    d.stats.totalLooted++;
    DailyTaskSystem.addProgress('dig');
    GameData.save();
    Game.refreshAll();
    SFX.play('buy');
    UI.showToast(`购入 ${item.name}！`);
  },

  // 获取距离下次刷新的剩余秒数
  getTimeRemaining() {
    const elapsed = Date.now() - this.lastRefresh;
    return Math.max(0, Math.ceil((this.refreshInterval - elapsed) / 1000));
  }
};

// ========== P4: 收藏家NPC ==========
const CollectorNPC = {
  collectors: [], // 3个收藏家
  npcNames: ['装备商', '佣兵王', '神秘人'],
  npcIcons: ['👤', '🤴', '🥷'],

  // 刷新收藏家需求
  refresh() {
    this.collectors = [];
    const categories = ['gun', 'blade', 'equip', 'part', 'special'];
    const qualities = ['rar', 'epi', 'leg', 'myt'];
    const usedNames = new Set();

    for (let i = 0; i < 3; i++) {
      // 随机选一个名字
      let nameIdx;
      do { nameIdx = randomInt(0, this.npcNames.length - 1); } while (usedNames.has(nameIdx));
      usedNames.add(nameIdx);

      // 随机需求类型：按分类 或 按品质
      const wantType = Math.random() < 0.5 ? 'category' : 'quality';
      let wantValue, wantLabel;
      if (wantType === 'category') {
        wantValue = categories[randomInt(0, categories.length - 1)];
        const catLabels = {gun:'枪械', blade:'冷兵器', equip:'装备', part:'配件', special:'特殊'};
        wantLabel = catLabels[wantValue] || wantValue;
      } else {
        wantValue = qualities[randomInt(0, qualities.length - 1)];
        wantLabel = QUALITY_CONFIG[wantValue].name + '级';
      }

      // 收购倍率 2.5~5x
      const multiplier = (2.5 + Math.random() * 2.5).toFixed(1);

      this.collectors.push({
        name: this.npcNames[nameIdx],
        icon: this.npcIcons[nameIdx],
        wantType: wantType,
        wantValue: wantValue,
        wantLabel: wantLabel,
        multiplier: parseFloat(multiplier)
      });
    }
  },

  // 获取匹配收藏家需求的背包物品
  getMatchingItems(collector) {
    return GameData.data.inventory.filter(item => {
      if (collector.wantType === 'category') return item.category === collector.wantValue;
      else return item.quality === collector.wantValue;
    });
  },

  // 出售给收藏家
  sellToCollector(index) {
    const collector = this.collectors[index];
    if (!collector) return;

    const matching = this.getMatchingItems(collector);
    if (matching.length === 0) {
      UI.showToast('没有匹配的物品！');
      return;
    }

    // 找到最贵的匹配物品出售
    const best = matching.sort((a, b) => b.price - a.price)[0];
    const bonus = 1 + GameData.data.skills.negotiation * 0.05;
    let sellPrice = Math.floor(best.price * collector.multiplier * bonus);

    // 双倍出售buff
    if (AdSystem.doubleActive && Date.now() < AdSystem.doubleExpireTime) {
      sellPrice *= 2;
      AdSystem.doubleActive = false;
      UI.showToast('双倍出售已生效！');
    }

    // 从背包移除
    const idx = GameData.data.inventory.findIndex(i => i.id === best.id);
    if (idx !== -1) GameData.data.inventory.splice(idx, 1);

    GameData.data.player.gold += sellPrice;
    GameData.data.stats.totalSold++;
    GameData.data.stats.totalEarned += sellPrice;
    GameData.data.player.exp += 10;

    GameData.save();
    Game.refreshAll();
    SFX.play('coin');
    UI.showToast(`以 ${collector.multiplier}x 出售 ${best.name}！+💰${formatGold(sellPrice)}`);
  }
};

// ========== P4: 广告系统 ==========
const AdSystem = {
  doubleActive: false,       // 双倍出售buff是否激活
  doubleExpireTime: 0,       // 双倍buff过期时间
  adPlaying: false,          // 广告是否正在播放

  // 观看广告（模拟2秒延迟）
  watchAd(type) {
    const d = GameData.data;
    // 检查每日限制
    switch(type) {
      case 'refreshMarket':
        if (d.ads.refreshToday >= 5) { UI.showToast('今日刷新次数已用完'); return; }
        d.ads.refreshToday++;
        break;
      case 'doubleSell':
        if (d.ads.doubleToday >= 5) { UI.showToast('今日双倍次数已用完'); return; }
        d.ads.doubleToday++;
        break;
      case 'freeAppraise':
        if (d.ads.appraiseToday >= 10) { UI.showToast('今日免费鉴定次数已用完'); return; }
        d.ads.appraiseToday++;
        break;
      default: return;
    }

    // 显示广告加载弹窗
    UI.showAdRewardModal(type);

    // 模拟2秒广告
    setTimeout(() => {
      let rewardText = '';
      switch(type) {
        case 'refreshMarket':
          MarketEngine.refresh();
          rewardText = '交易所已刷新！';
          break;
        case 'doubleSell':
          this.doubleActive = true;
          this.doubleExpireTime = Date.now() + 300000; // 5分钟内有效
          rewardText = '下次出售双倍收益！（5分钟内有效）';
          break;
        case 'freeAppraise':
          rewardText = '获得1次免费鉴定！';
          // 标记免费鉴定（简化实现：直接给一个提示）
          break;
      }
      GameData.save();
      // 更新弹窗显示奖励
      const adIcon = document.getElementById('adRewardIcon');
      const adTitle = document.getElementById('adRewardTitle');
      const adDesc = document.getElementById('adRewardDesc');
      const adBtn = document.getElementById('adRewardBtn');
      if (adIcon) adIcon.textContent = '🎁';
      if (adTitle) adTitle.textContent = '广告奖励';
      if (adDesc) adDesc.textContent = rewardText;
      if (adBtn) { adBtn.textContent = '领取'; adBtn.style.opacity = '1'; adBtn.onclick = function(){ document.getElementById('adRewardModal').classList.remove('active'); SFX.play('success'); }; }
      AdSystem.adPlaying = false;
      SFX.play('coin');
      if (Game.currentTab === 'market') UI.refreshMarket();
    }, 2000);
  }
};

// ========== P4: 商店系统 ==========
const ShopSystem = {
  items: [], // 商店特殊商品

  // 商店商品模板
  shopTemplates: [
    { name: '仓库扩容券', icon: '🎒', desc: '立即扩容仓库一级', price: 500, action: 'expand' },
    { name: '体力药剂', icon: '⚡', desc: '立即恢复50点体力', price: 300, action: 'stamina' },
    { name: '鉴定秘籍', icon: '📖', desc: '鉴定技能经验+100', price: 800, action: 'skillBook' },
    { name: '探索加速器', icon: '🚀', desc: '下次探索双倍经验', price: 600, action: 'doubleExp' },
    { name: '修复工具包', icon: '🔧', desc: '修复全部损坏物品', price: 1000, action: 'repairAll' },
    { name: '幸运符', icon: '🍀', desc: '提升探索品质概率10分钟', price: 1500, action: 'luckBuff' }
  ],

  // 刷新商店商品（随机选4件）
  refresh() {
    this.items = [];
    const shuffled = [...this.shopTemplates].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(4, shuffled.length); i++) {
      const template = shuffled[i];
      // 价格随机浮动 0.8~1.2x
      const priceMultiplier = 0.8 + Math.random() * 0.4;
      this.items.push({
        ...template,
        price: Math.floor(template.price * priceMultiplier),
        id: generateId()
      });
    }
  },

  // 购买商店物品
  buyShopItem(index) {
    const d = GameData.data;
    const item = this.items[index];
    if (!item) return;
    if (d.player.gold < item.price) {
      UI.showToast('金币不足！');
      return;
    }

    d.player.gold -= item.price;
    SFX.play('buy');

    switch(item.action) {
      case 'expand': {
        const nl = d.backpack.level + 1;
        if (nl >= BACKPACK_LEVELS.length) { UI.showToast('仓库已满级！'); d.player.gold += item.price; return; }
        d.backpack.level = nl;
        d.backpack.rows = BACKPACK_LEVELS[nl].rows;
        d.backpack.cols = BACKPACK_LEVELS[nl].cols;
        UI.showToast('仓库扩容成功！' + BACKPACK_LEVELS[nl].name);
        break;
      }
      case 'stamina':
        d.player.stamina = Math.min(d.player.maxStamina, d.player.stamina + 50);
        UI.showToast('体力+50！');
        break;
      case 'skillBook':
        d.player.exp += 100;
        DigEngine.checkLevelUp();
        UI.showToast('获得100经验！');
        break;
      case 'doubleExp':
        UI.showToast('下次探索双倍经验已激活！');
        break;
      case 'repairAll': {
        let repaired = 0;
        d.inventory.forEach(i => { if (i.damaged) { i.damaged = false; i.durability = 100; repaired++; } });
        d.stats.totalRepaired += repaired;
        UI.showToast(repaired > 0 ? `修复了${repaired}件物品！` : '没有需要修复的物品');
        break;
      }
      case 'luckBuff':
        UI.showToast('幸运符已激活！10分钟内探索品质提升');
        break;
    }

    GameData.save();
    Game.refreshAll();
  }
};

// ========== 页面切换 ==========
const Game = {
  currentTab:'home',
  switchTab(t){SFX.init();SFX.play('click');if(this.currentTab==='scavenge'&&t!=='scavenge'){if(DigEngine.session.staminaUsed>0&&GameData.data.digItems.length>0){UI.showToast('探索中，请先放入仓库');return;}if(GameData.data.digItems.length>0){const d=GameData.data;GameData.data.digItems.forEach(item=>{d.inventory.push(item);d.stats.totalLooted++;});GameData.data.digItems=[];GameData.save();}}document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));const tp=document.getElementById('page-'+t);if(tp)tp.classList.add('active');document.querySelectorAll('.bottom-nav__item').forEach(i=>i.classList.toggle('active',i.dataset.tab===t));this.currentTab=t;this.refreshPage(t);},
  refreshPage(t){const map={home:()=>UI.refreshHome(),scavenge:()=>UI.refreshScavenge(),backpack:()=>UI.refreshBackpack(),market:()=>UI.refreshMarket(),growth:()=>UI.refreshGrowth()};if(map[t])map[t]();},
  refreshAll(){this.checkMapUnlocks();UI.updateStatusBar();this.refreshPage(this.currentTab);},
  checkMapUnlocks(){const d=GameData.data;let changed=false;ZONES.forEach((z,i)=>{if(d.maps.unlockedMaps.includes(i)||z.unlockType==='default')return;let cur=0;if(z.unlockType==='stat')cur=d.stats[z.unlockKey]||0;else if(z.unlockType==='level')cur=d.player.level;if(cur>=z.unlockVal){d.maps.unlockedMaps.push(i);changed=true;UI.showToast('🗺️ 新区域解锁: '+z.name);}});if(changed)GameData.save();}
};

// ========== UI ==========
// ========== 博物馆经营引擎 ==========
const MuseumEngine = {
  // 博物馆等级配置
  LEVELS: [
    { level:1, name:'小仓库', maxSlots:12, cols:4, rows:3, baseVisitors:1, upgradeCost:2000 },
    { level:2, name:'珍品店', maxSlots:24, cols:6, rows:4, baseVisitors:2, upgradeCost:10000 },
    { level:3, name:'武器展厅', maxSlots:40, cols:6, rows:7, baseVisitors:4, upgradeCost:50000 },
    { level:4, name:'军事博物馆', maxSlots:60, cols:6, rows:10, baseVisitors:8, upgradeCost:200000 },
    { level:5, name:'传奇装备库', maxSlots:84, cols:7, rows:12, baseVisitors:15, upgradeCost:800000 },
    { level:6, name:'世界级博物馆', maxSlots:120, cols:8, rows:15, baseVisitors:25, upgradeCost:0 }
  ],

  // 门票价格选项
  TICKET_OPTIONS: [
    { price:0, mult:2.0, label:'免费' },
    { price:10, mult:1.2, label:'10' },
    { price:30, mult:1.0, label:'30' },
    { price:80, mult:0.6, label:'80' },
    { price:200, mult:0.3, label:'200' }
  ],
  MAX_BIZ_HOURS: 8,

  // 计算博物馆评分
  calcScore() {
    const m = GameData.data.museum;
    if (!m.exhibits.length) return 0;
    let score = 0;
    m.exhibits.forEach(e => {
      const q = QUALITY_CONFIG[e.quality];
      score += q.order * 100 + Math.floor(e.price / 100);
    });
    return score;
  },

  // 计算展品加成
  calcBonus() {
    const m = GameData.data.museum;
    const score = this.calcScore();
    const levelConf = this.LEVELS[m.level - 1];
    return {
      visitorBonus: Math.floor(score / 500) + (MuseumEngine.getUsedSlots() >= levelConf.maxSlots ? 10 : 0),
      incomeBonus: 1 + m.exhibits.length * 0.05 + m.reputation * 0.01
    };
  },

  // 入驻展品（从背包移入博物馆）
  // 计算已用格子数
  getUsedSlots(){
    const m=GameData.data.museum;
    let used=0;
    m.exhibits.forEach(e=>{
      const s=UI._getItemSpan(e.size,e.category,e.icon);
      used+=s.w*s.h;
    });
    return used;
  },

  addExhibit(itemId) {
    const d = GameData.data;
    const idx = d.inventory.findIndex(i => i.id === itemId);
    if (idx === -1) return false;
    const item = d.inventory[idx];
    if (!item.appraised) { UI.showToast('请先鉴定该物品'); return false; }
    const levelConf = this.LEVELS[d.museum.level - 1];
    // 计算物品占的格子数
    const span=UI._getItemSpan(item.size,item.category,item.icon);
    const itemSlots=span.w*span.h;
    const usedSlots=this.getUsedSlots();
    if (usedSlots+itemSlots > levelConf.maxSlots) { UI.showToast(`展位不足！需要${itemSlots}格，剩余${levelConf.maxSlots-usedSlots}格`); return false; }
    d.museum.exhibits.push({ ...item });
    d.inventory.splice(idx, 1);
    d.stats.totalExhibited++;
    d.dailyTasks.exhibit++;
    d.museum.reputation += QUALITY_CONFIG[item.quality].order;
    GameData.save();
    SFX.play('legend');
    UI.showToast(`${item.name} 已入驻博物馆！`);
    AchievementSystem.check('exhibit');
    return true;
  },

  // 移除展品（放回背包）
  removeExhibit(exhibitIndex) {
    const d = GameData.data;
    if (exhibitIndex < 0 || exhibitIndex >= d.museum.exhibits.length) return;
    const item = d.museum.exhibits.splice(exhibitIndex, 1)[0];
    d.inventory.push(item);
    d.museum.reputation = Math.max(0, d.museum.reputation - QUALITY_CONFIG[item.quality].order);
    GameData.save();
    UI.showToast(`${item.name} 已放回仓库`);
  },

  // 升级博物馆
  upgrade() {
    const d = GameData.data;
    const nextLevel = d.museum.level + 1;
    if (nextLevel > this.LEVELS.length) { UI.showToast('博物馆已满级！'); return false; }
    const cost = this.LEVELS[nextLevel - 1].upgradeCost;
    if (d.player.gold < cost) { UI.showToast('金币不足！需要 ' + formatGold(cost)); return false; }
    d.player.gold -= cost;
    d.museum.level = nextLevel;
    GameData.save();
    SFX.play('legend');
    UI.showToast('博物馆升级成功！' + this.LEVELS[nextLevel - 1].name);
    AchievementSystem.check('museum_level');
    Game.refreshAll();
    return true;
  },

  // 模拟访客和收入（每分钟调用一次，仅在营业时生效）
  // 每秒客流累积（用小数累积，每秒调用）
  _visitorAccum: 0,
  tickVisitors() {
    const d = GameData.data;
    const m = d.museum;
    if (!m.exhibits.length) return;
    if (!m.isBizOpen) return;
    const levelConf = this.LEVELS[m.level - 1];
    const scoreMult = 1 + this.calcScore() / 1000;
    const ratePerHour = Math.max(1, (levelConf.baseVisitors + 1) * (m.ticketMult || 1) * scoreMult);
    // 每秒累积（1小时=3600秒）
    this._visitorAccum += ratePerHour / 3600;
    if (this._visitorAccum >= 1) {
      const visitors = Math.floor(this._visitorAccum);
      this._visitorAccum -= visitors;
      const ticketIncome = visitors * (m.ticketPrice || 0);
      m.dailyVisitors += visitors;
      m.dailyIncome += ticketIncome;
      m.totalIncome += ticketIncome;
      d.stats.totalVisitors += visitors;
      GameData.save();
    }
  },

  // 获取当前每小时客流速率
  getVisitorRate() {
    const m = GameData.data.museum;
    if (!m.exhibits.length) return 0;
    const levelConf = this.LEVELS[m.level - 1];
    const scoreMult = 1 + this.calcScore() / 1000;
    return Math.max(1, Math.floor((levelConf.baseVisitors + 1) * (m.ticketMult || 1) * scoreMult));
  },

  // 营业时间结算（每次打开首页时调用）
  tickBusiness() {
    const d = GameData.data;
    const m = d.museum;
    if (!m.isBizOpen) return;
    const now = Date.now();
    const elapsedHours = (now - m.bizStartTime) / 3600000;
    const availableHours = Math.min(elapsedHours, this.MAX_BIZ_HOURS - m.bizHoursUsed);
    if (availableHours <= 0) {
      m.isBizOpen = false;
      m.bizHoursUsed = this.MAX_BIZ_HOURS;
      GameData.save();
      return;
    }
    const levelConf = this.LEVELS[m.level - 1];
    const scoreMult = 1 + this.calcScore() / 1000;
    const visitorsPerHour = Math.max(1, Math.floor((levelConf.baseVisitors + 1) * (m.ticketMult || 1) * scoreMult));
    const newVisitors = Math.max(1, Math.floor(visitorsPerHour * availableHours));
    const ticketIncome = newVisitors * (m.ticketPrice || 0);
    m.dailyVisitors += newVisitors;
    m.dailyIncome += ticketIncome;
    m.totalIncome += ticketIncome;
    d.stats.totalVisitors += newVisitors;
    m.bizHoursUsed += availableHours;
    m.bizStartTime = now;
    if (m.bizHoursUsed >= this.MAX_BIZ_HOURS) {
      m.isBizOpen = false;
      m.bizHoursUsed = this.MAX_BIZ_HOURS;
    }
    GameData.save();
  },

  // 每日重置
  dailyReset() {
    const d = GameData.data;
    const today = new Date().toDateString();
    if (d.museum._lastReset === today) return;
    d.museum.dailyVisitors = 0;
    d.museum.dailyIncome = 0;
    d.museum._lastReset = today;
    GameData.save();
  }
};

// ========== 成就系统 ==========
const AchievementSystem = {
  DEFINITIONS: [
    { id:'first_dig', name:'初次探索', desc:'完成第一次探索', icon:'🎯', check: d => d.stats.totalLooted >= 1 },
    { id:'dig_50', name:'探索达人', desc:'累计探索50次', icon:'⛏️', check: d => d.stats.totalLooted >= 50 },
    { id:'dig_200', name:'探索专家', desc:'累计探索200次', icon:'🏆', check: d => d.stats.totalLooted >= 200 },
    { id:'first_appraise', name:'慧眼识珠', desc:'完成第一次鉴定', icon:'🔍', check: d => d.stats.totalAppraised >= 1 },
    { id:'appraise_50', name:'鉴定大师', desc:'累计鉴定50件物品', icon:'💎', check: d => d.stats.totalAppraised >= 50 },
    { id:'first_sell', name:'第一笔交易', desc:'完成第一次出售', icon:'💰', check: d => d.stats.totalSold >= 1 },
    { id:'earn_10k', name:'小有积蓄', desc:'累计收入达到1万', icon:'💵', check: d => d.stats.totalEarned >= 10000 },
    { id:'earn_100k', name:'腰缠万贯', desc:'累计收入达到10万', icon:'🏦', check: d => d.stats.totalEarned >= 100000 },
    { id:'earn_1m', name:'富甲一方', desc:'累计收入达到100万', icon:'👑', check: d => d.stats.totalEarned >= 1000000 },
    { id:'exhibit', name:'收藏家', desc:'入驻第一件展品', icon:'🏛️', check: d => d.stats.totalExhibited >= 1 },
    { id:'exhibit_10', name:'策展人', desc:'累计入驻10件展品', icon:'🖼️', check: d => d.stats.totalExhibited >= 10 },
    { id:'museum_level', name:'扩建计划', desc:'博物馆升级到2级', icon:'🔨', check: d => d.museum.level >= 2 },
    { id:'museum_level_5', name:'世界名馆', desc:'博物馆升级到5级', icon:'🌍', check: d => d.museum.level >= 5 },
    { id:'legend_item', name:'传说降临', desc:'获得一件传说品质物品', icon:'⭐', check: d => d.inventory.some(i=>i.quality==='leg') || d.museum.exhibits.some(i=>i.quality==='leg') },
    { id:'myth_item', name:'神话觉醒', desc:'获得一件神话品质物品', icon:'🌟', check: d => d.inventory.some(i=>i.quality==='myt') || d.museum.exhibits.some(i=>i.quality==='myt') },
    { id:'sign_7', name:'坚持一周', desc:'连续签到7天', icon:'📅', check: d => d.signIn.streak >= 7 },
    { id:'sign_30', name:'坚持不懈', desc:'连续签到30天', icon:'🗓️', check: d => d.signIn.streak >= 30 },
    { id:'visitor_100', name:'门庭若市', desc:'单日访客超过100人', icon:'👥', check: d => d.museum.dailyVisitors >= 100 },
  ],

  // 检查并解锁成就
  check(triggerId) {
    const d = GameData.data;
    let newUnlock = false;
    this.DEFINITIONS.forEach(def => {
      if (d.achievements.includes(def.id)) return;
      if (def.check(d)) {
        d.achievements.push(def.id);
        newUnlock = true;
        // 奖励金币
        const reward = 500 + d.achievements.length * 200;
        d.player.gold += reward;
        d.player.exp += 20;
        UI.showToast(`🏅 成就解锁：${def.name}！+${formatGold(reward)}`);
        SFX.play('legend');
      }
    });
    if (newUnlock) {
      GameData.save();
      Game.checkLevelUp();
    }
  },

  // 获取所有成就（含解锁状态）
  getAll() {
    const unlocked = GameData.data.achievements;
    return this.DEFINITIONS.map(def => ({
      ...def,
      unlocked: unlocked.includes(def.id)
    }));
  },

  // 获取已解锁数量
  getUnlockedCount() {
    return GameData.data.achievements.length;
  }
};

// ========== 每日任务系统 ==========
const DailyTaskSystem = {
  TASKS: [
    { key:'dig', name:'探索10次', target:10, reward:20, expReward:15 },
    { key:'appraise', name:'鉴定5件物品', target:5, reward:30, expReward:20 },
    { key:'sell', name:'出售3件物品', target:3, reward:25, expReward:15 },
    { key:'exhibit', name:'入驻1件展品', target:1, reward:50, expReward:30 },
  ],

  // 检查并重置每日任务
  checkReset() {
    const d = GameData.data;
    const today = new Date().toDateString();
    if (d.dailyTasks.lastResetDate === today) return;
    d.dailyTasks = { dig:0, appraise:0, sell:0, exhibit:0, lastResetDate:today, claimed:{} };
    GameData.save();
  },

  // 增加任务进度
  addProgress(key, count) {
    this.checkReset();
    const d = GameData.data;
    if (d.dailyTasks[key] !== undefined) {
      d.dailyTasks[key] += (count || 1);
      GameData.save();
    }
  },

  // 领取任务奖励
  claimTask(key) {
    const d = GameData.data;
    const task = this.TASKS.find(t => t.key === key);
    if (!task) return false;
    if ((d.dailyTasks.claimed && d.dailyTasks.claimed[key]) || d.dailyTasks[key] < task.target) return false;
    if (!d.dailyTasks.claimed) d.dailyTasks.claimed = {};
    d.dailyTasks.claimed[key] = true;
    d.player.stamina = Math.min(d.player.maxStamina, d.player.stamina + task.reward);
    d.player.exp += task.expReward;
    GameData.save();
    SFX.play('coin');
    UI.showToast(`任务完成！+${formatGold(task.reward)} +${task.expReward}exp`);
    Game.checkLevelUp();
    AchievementSystem.check('first_dig');
    return true;
  },

  // 获取任务列表（含状态）
  getTasks() {
    this.checkReset();
    const d = GameData.data;
    return this.TASKS.map(t => ({
      ...t,
      current: d.dailyTasks[t.key] || 0,
      completed: (d.dailyTasks[t.key] || 0) >= t.target,
      claimed: d.dailyTasks.claimed && d.dailyTasks.claimed[t.key]
    }));
  }
};

// ========== 签到系统 ==========
const SignInSystem = {
  REWARDS: [100, 150, 200, 300, 500, 800, 1000, 1500, 2000, 3000, 5000],

  canSignIn() {
    const d = GameData.data;
    const today = new Date().toDateString();
    return d.signIn.lastDate !== today;
  },

  signIn() {
    if (!this.canSignIn()) { UI.showToast('今日已签到'); return false; }
    const d = GameData.data;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    d.signIn.streak = (d.signIn.lastDate === yesterday) ? d.signIn.streak + 1 : 1;
    d.signIn.lastDate = today;
    d.signIn.totalDays++;
    const rewardIdx = Math.min(d.signIn.streak - 1, this.REWARDS.length - 1);
    const reward = this.REWARDS[rewardIdx];
    d.player.gold += reward;
    GameData.save();
    SFX.play('coin');
    UI.showToast(`签到成功！连续${d.signIn.streak}天，+${formatGold(reward)}`);
    AchievementSystem.check('sign_7');
    AchievementSystem.check('sign_30');
    Game.refreshAll();
    return true;
  }
};

const UI = {
  updateStatusBar(){const d=GameData.data;document.getElementById('goldDisplay').textContent='💰 '+formatGold(d.player.gold);document.getElementById('staminaDisplay').textContent='⚡ '+d.player.stamina+'/'+d.player.maxStamina;},
  updateDigProgress(){/* 不再需要进度条 */},
  updateDigBackpack(){
    const wrap=document.getElementById('digBackpackGrid');
    const count=document.getElementById('digBackpackCount');
    const levelEl=document.getElementById('digBackpackLevel');
    if(!wrap)return;
    const d=GameData.data;
    const bpLevel=DIG_BACKPACK_LEVELS[(d.digBackpack||{level:1}).level-1]||DIG_BACKPACK_LEVELS[0];
    const maxSlots=bpLevel.slots;
    const items=GameData.data.digItems||[];
    // 计算已用格子数
    let usedSlots=0;
    items.forEach(it=>{const s=this._getItemSpan(it.size,it.category,it.icon);usedSlots+=s.w*s.h;});
    if(count)count.textContent=usedSlots+'/'+maxSlots+'格 ('+items.length+'件)';
    if(levelEl)levelEl.textContent='Lv.'+bpLevel.level+' '+bpLevel.name;

    const upgradeBtn=document.getElementById('btnUpgradeDigBP');
    if(upgradeBtn){
      if(d.digBackpack.level>=5){upgradeBtn.style.display='none';}
      else{const next=DIG_BACKPACK_LEVELS[d.digBackpack.level];upgradeBtn.textContent='升级（'+formatGold(next.upgradeCost)+'）';upgradeBtn.style.display='';}
    }

    // 探索背包独立渲染
    const containerWidth=wrap.clientWidth||wrap.parentElement?.clientWidth||Math.min(window.innerWidth-32,400);
    const cols=Math.max(6,Math.floor(containerWidth/30));
    const rows=Math.ceil(maxSlots/cols);
    const grid=document.createElement('div');
    grid.style.cssText=`display:grid;grid-template-columns:repeat(${cols},1fr);grid-auto-rows:1fr;gap:0;border:1px solid rgba(255,255,255,0.1);box-sizing:border-box;width:100%;aspect-ratio:${cols}/${rows};`;
    wrap.innerHTML='';wrap.appendChild(grid);

    // 装箱
    const occ=Array.from({length:rows},()=>Array(cols).fill(false));
    const placed=[];
    items.forEach(item=>{
      const span=this._getItemSpan(item.size,item.category,item.icon);
      let px=0,py=0;
      for(let r=0;r<=rows-span.h;r++){for(let c=0;c<=cols-span.w;c++){let ok=true;for(let dr=0;dr<span.h&&ok;dr++)for(let dc=0;dc<span.w&&ok;dc++)if(occ[r+dr][c+dc])ok=false;if(ok){px=c;py=r;r=rows;break;}}if(py||px)break;}
      if(py!==undefined){for(let dr=0;dr<span.h;dr++)for(let dc=0;dc<span.w;dc++)occ[py+dr][px+dc]=true;placed.push({item,x:px,y:py,w:span.w,h:span.h});}
    });

    // 渲染
    const cells=Array.from({length:rows},()=>Array(cols).fill(null));
    placed.forEach(p=>{for(let dr=0;dr<p.h;dr++)for(let dc=0;dc<p.w;dc++)cells[p.y+dr][p.x+dc]=p;});
    for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){const ci=cells[r][c];const isOrigin=placed.some(p=>p.x===c&&p.y===r);if(ci&&!isOrigin)continue;if(!ci){const cell=document.createElement('div');cell.className='bp-grid-cell';grid.appendChild(cell);}else{const p=placed.find(pp=>pp.x===c&&pp.y===r);const isLarge=p.w>=2||p.h>=2;const el=document.createElement('div');el.className=`bp-item bp-item--${p.item.quality}`;el.style.gridColumn=`span ${p.w}`;el.style.gridRow=`span ${p.h}`;el.innerHTML=`<span class="bp-item__icon ${isLarge?'bp-item__icon--lg':''}">${iconHtml(p.item.icon, p.w>=3?56:p.w>=2?40:24, p.item.quality)}</span>`;el.style.cursor='default';grid.appendChild(el);}}}
  },

  // ===== 首页 =====
  refreshHome(){
    const d=GameData.data, m=d.museum;
    MuseumEngine.tickBusiness();
    const levelConf=MuseumEngine.LEVELS[m.level-1];
    const ml=document.getElementById('museumLevel');
    if(ml){
      ml.textContent='Lv.'+m.level+' · '+levelConf.name;
      document.getElementById('dailyVisitors').textContent=m.dailyVisitors+' 人';
      document.getElementById('dailyIncome').textContent='💰 '+formatGold(m.dailyIncome);
      document.getElementById('museumScore').textContent=MuseumEngine.calcScore()+' 分';
    }
    // 始终更新门票价格和营业状态（即使博物馆区域不可见）
    this.updateBizStatus();
    this._updateMuseumDisplay();

    // 实时更新博物馆数据（每5秒）
    if(this._bizTimer)clearInterval(this._bizTimer);
    this._bizTimer=setInterval(()=>{
      const d=GameData.data;
      if(d.museum.isBizOpen){
        MuseumEngine.tickBusiness();
      }
      this.updateBizStatus();
      this._updateMuseumDisplay();
    },5000);

    // 签到按钮
    const signBtn=document.getElementById('btnSignIn');
    if(signBtn){
      const canSign=SignInSystem.canSignIn();
      signBtn.textContent=canSign?'📅 签到（连续'+d.signIn.streak+'天）':'✅ 已签到';
      signBtn.disabled=!canSign;
    }
  },

  // ===== 探索页 =====
  refreshScavenge(){
    if(!this._scavengeEntered&&(!GameData.data.digItems||GameData.data.digItems.length===0)){this._scavengeEntered=true;setTimeout(()=>this.showMapModal(),300);}else{this._scavengeEntered=true;}
    const d=GameData.data,z=ZONES[d.maps.currentMap];
    document.getElementById('zoneName').textContent=z.name;
    document.getElementById('zoneStars').textContent='⭐'.repeat(z.stars);
    document.getElementById('zoneTicket').textContent=z.ticket===0?'免费':formatGold(z.ticket);
    StaminaSystem.updateDisplay();
    UI.updateDigBackpack();
  },
  _generateDigBackpack(slots){
    const grid=document.getElementById('digBackpackGrid');
    if(!grid)return;
    grid.innerHTML='';
    for(let i=0;i<slots;i++){
      const cell=document.createElement('div');
      cell.className='bp-grid-cell';
      grid.appendChild(cell);
    }
  },
  generateDigGrid(){const d=GameData.data,z=ZONES[d.maps.currentMap],g=document.getElementById('digGrid');g.innerHTML='';g.classList.remove('dig-grid--complete');const{cols,rows}=z.gridSize;g.style.gridTemplateColumns=`repeat(${cols},1fr)`;for(let i=0;i<cols*rows;i++){const c=document.createElement('div');c.className='dig-cell dig-cell--hidden';c.dataset.index=i;c.addEventListener('click',()=>{SFX.init();DigEngine.resetSession();DigEngine.digCell(i);});g.appendChild(c);}this.updateDigProgress();},

  // ===== 背包页（P3增强） =====
  refreshBackpack(){
    const d=GameData.data;
    const grid=document.getElementById('backpackGrid');
    if(!grid)return;
    grid.innerHTML='';
    grid.className='market-sell-grid';
    grid.style='';

    // 更新分类数量
    const counts=BackpackState.getCounts();
    const countMap={all:'countAll',gun:'countGun',blade:'countBlade',equip:'countEquip',part:'countPart',special:'countSpecial'};
    for(const[k,id] of Object.entries(countMap)){const el=document.getElementById(id);if(el)el.textContent=counts[k];}

    // 更新多选栏
    const bar=document.getElementById('multiSelectBar');
    if(BackpackState.multiSelect){bar.classList.add('active');document.getElementById('selectedCount').textContent=BackpackState.selectedIds.size;}
    else{bar.classList.remove('active');}

    // 更新底部按钮数量
    const ua=document.getElementById('unappraisedCount');
    const dm=document.getElementById('damagedCount');
    if(ua)ua.textContent=d.inventory.filter(i=>!i.appraised).length;
    if(dm)dm.textContent=d.inventory.filter(i=>i.damaged).length;

    // 仓库无限大，显示物品总数
    document.getElementById('backpackCount').textContent=d.inventory.length+'件';

    // 获取筛选后的物品
    const items=BackpackState.getFilteredItems();

    if(items.length===0){
      grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:20px 0;font-size:12px;">仓库空空如也</div>';
      return;
    }

    const bonus=1+Math.min(d.skills.negotiation*0.1,200)*0.01;
    items.forEach(item=>{
      const qc=QUALITY_CONFIG[item.quality];
      const sellPrice=Math.floor(item.price*bonus);
      const el=document.createElement('div');
      el.className='market-sell-card market-sell-card--'+item.quality;
      let tags='';
      if(!item.appraised) tags+='<span class="market-sell-card__tag market-sell-card__tag--unk">未鉴定</span>';
      if(item.damaged) tags+='<span class="market-sell-card__tag market-sell-card__tag--half">受损</span>';
      el.innerHTML=`
        <span class="market-sell-card__icon">${iconHtml(item.icon,itemIconSize(item.size),item.quality)}</span>
        <span class="market-sell-card__name">${item.name}</span>
        <span class="market-sell-card__price">💰${formatGold(sellPrice)}</span>
        ${tags?'<div class="market-sell-card__tags">'+tags+'</div>':''}
      `;
      el.addEventListener('click',()=>{
        if(BackpackState.multiSelect){SFX.play('click');BackpackState.toggleSelect(item.id);this.refreshBackpack();}
        else this.showItemModal(item);
      });
      grid.appendChild(el);
    });
  },

  // ===== 一键鉴定 =====
  batchAppraise(){
    const d=GameData.data,level=d.skills.appraiseEye;
    const unappraised=d.inventory.filter(i=>!i.appraised);
    if(unappraised.length===0){this.showToast('没有需要鉴定的物品');return;}
    let count=0;
    unappraised.forEach(item=>{
      item.appraised=true;item.appraiseLevel=level;
      const mult=+(0.8+Math.random()*0.7).toFixed(2);
      item.price=Math.floor(item.basePrice*mult);
      item.story=this.generateAppraiseClues(item,level).join('\n');
      count++;d.stats.totalAppraised++;
    });
    SFX.play('appraise');GameData.save();Game.refreshAll();
    this.showToast(`一键鉴定完成！${count}件物品已鉴定`);
  },

  // ===== 一键修复 =====
  batchRepair(){
    const d=GameData.data;
    const damaged=d.inventory.filter(i=>i.damaged);
    if(damaged.length===0){this.showToast('没有需要修复的物品');return;}
    let totalCost=0;
    damaged.forEach(item=>{
      const baseCost=Math.floor(item.price*(1-item.durability/100));
      const skillDiscount=1-Math.min(d.skills.repair*0.1,90)*0.01;
      const cost=Math.max(100,Math.floor(baseCost*skillDiscount));
      totalCost+=cost;
    });
    if(d.player.gold<totalCost){this.showToast(`金币不足！修复需要 ${formatGold(totalCost)}`);return;}
    d.player.gold-=totalCost;
    damaged.forEach(item=>{item.damaged=false;item.durability=100;d.stats.totalRepaired++;});
    SFX.play('repair');GameData.save();Game.refreshAll();
    this.showToast(`一键修复完成！${damaged.length}件物品，花费 ${formatGold(totalCost)}`);
  },

  // ===== 博物馆弹窗 =====
  showMuseumModal(){
    const body=document.getElementById('museumModalBody');
    if(!body){UI.showToast('博物馆功能开发中');return;}
    const d=GameData.data, m=d.museum;
    const levelConf=MuseumEngine.LEVELS[m.level-1];
    this._museumTab='exhibits';
    this._renderMuseumContent(body,levelConf);
    document.getElementById('museumModal').classList.add('active');
  },

  _getItemSpan(size,category,icon){
    // emoji图标强制1x1
    if(icon&&!icon.startsWith('assets/'))return {w:1,h:1};
    // 枪械横向长条，装备/刀刃方形
    const isGun=category==='gun';
    if(size>=5) return isGun?{w:4,h:1}:{w:2,h:2};
    if(size>=4) return isGun?{w:3,h:1}:{w:2,h:2};
    if(size>=3) return isGun?{w:3,h:1}:{w:2,h:2};
    if(size>=2) return {w:2,h:2};
    return {w:1,h:1};
  },

  // 构建网格（空格子 + 物品span，单层grid）
  _buildTwoLayerGrid(container, cols, rows, items, isExhibit){
    container.innerHTML='';
    const grid=document.createElement('div');
    // 用CSS 1fr自动填满容器宽度，不需要JS计算
    grid.style.cssText=`display:grid;grid-template-columns:repeat(${cols},1fr);grid-auto-rows:1fr;gap:0;border:1px solid rgba(255,255,255,0.1);box-sizing:border-box;width:100%;aspect-ratio:${cols}/${rows};`;

    let dynCols=cols;
    let dynRows=rows;
    let occ=Array.from({length:dynRows},()=>Array(dynCols).fill(false));
    const placed=[];
    items.forEach(({item, idx})=>{
      const span=this._getItemSpan(item.size,item.category,item.icon);
      while(dynRows-span.h<0||dynCols-span.w<0){
        if(dynCols-span.w<0)dynCols++;else dynRows++;
        const newOcc=Array.from({length:dynRows},(_,r)=>Array(dynCols).fill(false));
        for(let r=0;r<occ.length;r++)for(let c=0;c<occ[r].length;c++)newOcc[r][c]=occ[r][c];
        occ=newOcc;
      }
      let px=0,py=0;
      for(let r=0;r<=dynRows-span.h;r++){
        for(let c=0;c<=dynCols-span.w;c++){
          let ok=true;
          for(let dr=0;dr<span.h&&ok;dr++)for(let dc=0;dc<span.w&&ok;dc++)if(occ[r+dr][c+dc])ok=false;
          if(ok){px=c;py=r;r=dynRows;break;}
        }
        if(py||px)break;
      }
      for(let dr=0;dr<span.h;dr++)for(let dc=0;dc<span.w;dc++)occ[py+dr][px+dc]=true;
      placed.push({item,idx,x:px,y:py,w:span.w,h:span.h});
    });

    // grid样式已在上面设置

    // 二维图
    const cells=Array.from({length:dynRows},()=>Array(dynCols).fill(null));
    placed.forEach(p=>{for(let dr=0;dr<p.h;dr++)for(let dc=0;dc<p.w;dc++)cells[p.y+dr][p.x+dc]=p;});

    // 渲染
    for(let r=0;r<dynRows;r++){
      for(let c=0;c<dynCols;c++){
        const ci=cells[r][c];
        const isOrigin=placed.some(p=>p.x===c&&p.y===r);
        if(ci&&!isOrigin) continue;
        if(!ci){
          const cell=document.createElement('div');
          cell.className='bp-grid-cell';
          grid.appendChild(cell);
        } else {
          const p=placed.find(pp=>pp.x===c&&pp.y===r);
          const qc=QUALITY_CONFIG[p.item.quality];
          const isLarge=p.w>=2||p.h>=2;
          const el=document.createElement('div');
          el.className=`bp-item bp-item--${p.item.quality}`;
          el.style.gridColumn=`span ${p.w}`;
          el.style.gridRow=`span ${p.h}`;
          el.innerHTML=`<span class="bp-item__icon ${isLarge?'bp-item__icon--lg':''}">${iconHtml(p.item.icon, p.w >= 3 ? 56 : p.w >= 2 ? 40 : 24, p.item.quality)}</span>`;
          if(isExhibit){
            const btn=document.createElement('button');
            btn.className='btn btn--sm btn--primary museum-remove-btn';
            btn.dataset.idx=p.idx;
            btn.textContent='下架';
            btn.style.cssText='position:absolute;bottom:1px;right:1px;font-size:8px;height:16px;padding:0 4px;';
            el.appendChild(btn);
          } else {
            const btn=document.createElement('button');
            btn.className='btn btn--sm btn--primary museum-add-btn';
            btn.dataset.id=p.item.id;
            btn.textContent='上架';
            btn.style.cssText='position:absolute;bottom:1px;right:1px;font-size:8px;height:16px;padding:0 4px;';
            el.appendChild(btn);
          }
          grid.appendChild(el);
        }
      }
    }
    container.appendChild(grid);
  },

  _renderMuseumContent(body,levelConf){
    const d=GameData.data, m=d.museum;
    if(!levelConf) levelConf=MuseumEngine.LEVELS[m.level-1];
    const isExhibits=this._museumTab==='exhibits';

    let html=`<div class="museum-header">
      <div class="museum-stats">
        <span>Lv.${m.level} · ${levelConf.name}</span>
        <span>展位 ${MuseumEngine.getUsedSlots()}/${levelConf.maxSlots}格</span>
        <span>评分 ${MuseumEngine.calcScore()}</span>
      </div>
      <div class="museum-tabs">
        <button class="museum-tabs__item ${isExhibits?'active':''}" id="museumTabExhibits">展品</button>
        <button class="museum-tabs__item ${!isExhibits?'active':''}" id="museumTabBackpack">上架</button>
      </div>
    </div>`;

    if(isExhibits){
      // 展品网格（和上架页面一样的网格布局）
      html+=`<div class="museum-grid-wrap" id="museumExhibitWrap"></div>`;
      // 升级按钮
      if(m.level<MuseumEngine.LEVELS.length){
        const next=MuseumEngine.LEVELS[m.level];
        html+=`<button class="btn btn--primary btn--block" id="btnMuseumUpgrade" style="margin-top:6px;">升级（${formatGold(next.upgradeCost)}）</button>`;
      }
    } else {
        // 背包列表（只显示已鉴定物品）
        const appraised=d.inventory.filter(i=>i.appraised);
        if(!appraised.length){
          html+=`<div style="text-align:center;color:var(--text-secondary);padding:20px 0;font-size:12px;">没有可上架的物品（需先鉴定）</div>`;
        } else {
          html+=`<div class="museum-grid-wrap" id="museumBackpackWrap"></div>`;
        }
      }

    body.innerHTML=html;

    // 渲染展品网格
    const exhibitWrap=document.getElementById('museumExhibitWrap');
    if(exhibitWrap){
      const cols=levelConf.cols, rows=levelConf.rows;
      this._buildTwoLayerGrid(exhibitWrap,cols,rows,m.exhibits.map((e,i)=>({item:e,idx:i})),true);
    }

    // 渲染上架背包（卡片样式）
    const bpWrap=document.getElementById('museumBackpackWrap');
    if(bpWrap){
      bpWrap.innerHTML='';
      const grid=document.createElement('div');
      grid.className='market-sell-grid';
      const appraised=d.inventory.filter(i=>i.appraised).sort((a,b)=>QUALITY_CONFIG[b.quality].order-QUALITY_CONFIG[a.quality].order);
      if(appraised.length===0){
        grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:20px 0;font-size:12px;">没有可上架的物品</div>';
      } else {
        appraised.forEach(item=>{
          const qc=QUALITY_CONFIG[item.quality];
          const el=document.createElement('div');
          el.className='market-sell-card market-sell-card--'+item.quality;
          el.innerHTML=`
            <span class="market-sell-card__icon">${iconHtml(item.icon,itemIconSize(item.size),item.quality)}</span>
            <span class="market-sell-card__name">${item.name}</span>
            <span class="market-sell-card__price" style="color:${qc.color}">${qc.label}</span>
            <button class="btn btn--sm btn--primary market-sell-card__btn museum-add-btn" data-id="${item.id}">上架</button>
          `;
          grid.appendChild(el);
        });
      }
      bpWrap.appendChild(grid);
    }

    // 绑定标签切换
    const tabE=document.getElementById('museumTabExhibits');
    const tabB=document.getElementById('museumTabBackpack');
    if(tabE) tabE.addEventListener('click',()=>{this._museumTab='exhibits';this._renderMuseumContent(body);});
    if(tabB) tabB.addEventListener('click',()=>{this._museumTab='backpack';this._renderMuseumContent(body);});

    // 绑定下架按钮
    body.querySelectorAll('.museum-remove-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{MuseumEngine.removeExhibit(parseInt(btn.dataset.idx));this._renderMuseumContent(body);});
    });

    // 绑定上架按钮
    body.querySelectorAll('.museum-add-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        if(MuseumEngine.addExhibit(btn.dataset.id)){
          this._museumTab='exhibits';
          this._renderMuseumContent(body);
        }
      });
    });

    // 绑定升级按钮
    const upgBtn=document.getElementById('btnMuseumUpgrade');
    if(upgBtn) upgBtn.addEventListener('click',()=>{MuseumEngine.upgrade();this._renderMuseumContent(body);});
  },

  // ===== 成就弹窗 =====
  showAchievementModal(){
    const achievements=AchievementSystem.getAll();
    const unlocked=achievements.filter(a=>a.unlocked).length;
    const body=document.getElementById('achievementModalBody');
    let html=`<div style="text-align:center;margin-bottom:8px;font-size:12px;color:var(--text-secondary);">已解锁 ${unlocked}/${achievements.length}</div>`;
    html+=`<div class="achievement-list">`;
    achievements.forEach(a=>{
      html+=`<div class="achievement-item ${a.unlocked?'achievement-item--unlocked':''}">
        <span class="achievement-item__icon">${iconHtml(a.icon)}</span>
        <div class="achievement-item__info">
          <span class="achievement-item__name">${a.name}</span>
          <span class="achievement-item__desc">${a.desc}</span>
        </div>
        <span class="achievement-item__status">${a.unlocked?'✅':'🔒'}</span>
      </div>`;
    });
    html+=`</div>`;
    body.innerHTML=html;
    document.getElementById('achievementModal').classList.add('active');
  },

  // ===== 物品详情弹窗（P3增强） =====
  showItemModal(item){
    const modal=document.getElementById('itemModal'),qc=QUALITY_CONFIG[item.quality];
    document.getElementById('modalIconText').innerHTML=iconHtml(item.icon,itemIconSize(item.size,48),item.quality);
    document.getElementById('modalIcon').style.borderColor=qc.color;
    document.getElementById('modalName').textContent=item.name;
    const tag=document.getElementById('modalQualityTag');tag.textContent=qc.label+' · '+qc.name;tag.className='quality-tag quality-tag--'+item.quality;
    const highQuality=['epi','leg','myt'].includes(item.quality);
    if(!item.appraised&&highQuality){
      document.getElementById('modalPrice').textContent='💰 ??? (需鉴定)';
    }else{
      document.getElementById('modalPrice').textContent='💰 '+formatGold(item.price)+(item.appraised?'':' (未鉴定·基础价)');
    }
    document.getElementById('modalSize').textContent=item.size+'格';

    // 耐久度
    const durBar=document.getElementById('modalDurability');
    const durText=document.getElementById('modalDurabilityText');
    durBar.style.width=item.durability+'%';
    durText.textContent=item.durability+'%';
    durBar.className='durability-bar__fill '+(item.durability>60?'durability-bar__fill--high':item.durability>30?'durability-bar__fill--mid':'durability-bar__fill--low');

    // 鉴定故事
    const storyEl=document.getElementById('modalStory');
    if(item.appraised&&item.story){storyEl.textContent=item.story;storyEl.className='modal__story';}
    else{storyEl.textContent='🔒 未鉴定，无法查看详细信息';storyEl.className='modal__story modal__story--locked';}

    // 操作按钮
    const actionBtn=document.getElementById('modalAction');
    const repairBtn=document.getElementById('modalRepair');

    if(!item.appraised){actionBtn.textContent='🔍 鉴定';actionBtn.onclick=()=>{this.appraiseItem(item);};}
    else{actionBtn.textContent='去交易出售';actionBtn.onclick=()=>{modal.classList.remove('active');Game.switchTab('market');};}

    // 修复按钮
    if(item.damaged){
      repairBtn.style.display='';
      repairBtn.onclick=()=>{modal.classList.remove('active');this.showRepairModal(item);};
    }else{repairBtn.style.display='none';}

    modal.classList.add('active');
  },

  // ===== 鉴定物品（P3增强：动画+词条） =====
  appraiseItem(item){
    const d=GameData.data,skillLevel=d.skills.appraiseEye;
    const modal=document.getElementById('itemModal');
    const content=document.getElementById('itemModalContent');

    // 开始鉴定动画
    content.classList.add('appraise-scanning');
    document.getElementById('modalAction').disabled=true;
    SFX.play('appraise');

    // 1.5秒后完成鉴定
    setTimeout(()=>{
      item.appraised=true;item.appraiseLevel=skillLevel;d.stats.totalAppraised++;DailyTaskSystem.addProgress('appraise');
      const mult=+(0.8+Math.random()*0.7).toFixed(2);
      item.price=Math.floor(item.basePrice*mult);

      // 生成鉴定词条
      const clues=this.generateAppraiseClues(item,skillLevel);
      item.story=clues.join('\n');

      // 更新UI
      content.classList.remove('appraise-scanning');
      content.classList.add('appraise-revealed');
      setTimeout(()=>content.classList.remove('appraise-revealed'),600);

      // 更新故事区域
      const storyEl=document.getElementById('modalStory');
      storyEl.innerHTML='';
      clues.forEach((clue,i)=>{
        const div=document.createElement('div');
        div.className='appraise-clue'+(i===clues.length-1?' appraise-clue--highlight':'');
        div.textContent=clue;
        div.style.animationDelay=(i*0.15)+'s';
        storyEl.appendChild(div);
      });
      storyEl.className='modal__story';

      // 更新按钮
      const actionBtn=document.getElementById('modalAction');
      actionBtn.disabled=false;
      actionBtn.textContent='去交易出售';
      actionBtn.onclick=()=>{modal.classList.remove('active');Game.switchTab('market');};

      // 修复按钮
      const repairBtn=document.getElementById('modalRepair');
      if(item.damaged){repairBtn.style.display='';repairBtn.onclick=()=>{modal.classList.remove('active');this.showRepairModal(item);};}

      SFX.play(QUALITY_CONFIG[item.quality].sfx);
      GameData.save();Game.refreshAll();
    },1500);
  },

  // 生成鉴定词条
  generateAppraiseClues(item,level){
    const qc=QUALITY_CONFIG[item.quality];
    const catName={gun:'枪械',blade:'冷兵器',equip:'装备',part:'配件',special:'特殊物品'}[item.category]||'物品';
    const clues=[];

    clues.push(`▸ 类型判定：${catName}`);

    if(level>=3)clues.push(`▸ 初步识别：疑似${item.name}系列`);

    if(level>=5)clues.push(`▸ 品质评估：${qc.name}级（${qc.label}）`);

    if(level>=8){
      const valueDesc=item.price>=10000000?'天价珍品':item.price>=1000000?'高价收藏品':item.price>=100000?'价值不菲':item.price>=10000?'有一定价值':'普通货色';
      clues.push(`▸ 收藏价值：${valueDesc}`);
    }

    if(level>=10)clues.push(`▸ 精确估价：${formatGold(item.price)}`);

    return clues;
  },

  // ===== 修复弹窗 =====
  showRepairModal(item){
    const d=GameData.data;
    // 修复费用 = 物品价格 * (1 - 耐久度/100) * (1 - 修复技能*0.05)
    const baseCost=Math.floor(item.price*(1-item.durability/100));
    const skillDiscount=1-Math.min(d.skills.repair*0.1,90)*0.01;
    const cost=Math.max(100,Math.floor(baseCost*skillDiscount));

    document.getElementById('repairItemName').innerHTML=iconHtml(item.icon,itemIconSize(item.size,20),item.quality)+' '+item.name;
    document.getElementById('repairCurrentDur').textContent=item.durability+'%';
    document.getElementById('repairCost').textContent='💰 '+formatGold(cost);

    const confirmBtn=document.getElementById('repairConfirm');
    if(d.player.gold<cost){confirmBtn.disabled=true;confirmBtn.textContent='金币不足';}
    else{confirmBtn.disabled=false;confirmBtn.textContent='确认修复';}

    confirmBtn.onclick=()=>{
      if(d.player.gold<cost)return;
      d.player.gold-=cost;item.damaged=false;item.durability=100;d.stats.totalRepaired++;
      GameData.save();Game.refreshAll();
      SFX.play('repair');
      document.getElementById('repairModal').classList.remove('active');
      UI.showToast('修复完成！'+item.name+' 耐久100%，售价提升');
    };

    document.getElementById('repairCancel').onclick=()=>document.getElementById('repairModal').classList.remove('active');
    document.getElementById('repairModal').addEventListener('click',(e)=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('active');},{once:true});
    document.getElementById('repairModal').classList.add('active');
  },

  // ===== 批量出售弹窗 =====
  showBatchSellModal(){
    const selected=BackpackState.getSelectedItems();
    if(selected.length===0){UI.showToast('请先选择要出售的物品');return;}

    const d=GameData.data,bonus=1+Math.min(d.skills.negotiation*0.1,200)*0.01;
    let totalValue=0;
    selected.forEach(i=>totalValue+=Math.floor(i.price*bonus));

    document.getElementById('batchSellCount').textContent=selected.length;
    document.getElementById('batchSellValue').textContent=formatGold(totalValue);

    const list=document.getElementById('batchSellList');list.innerHTML='';
    selected.forEach(i=>{
      const el=document.createElement('div');el.className='batch-sell-item';
      el.innerHTML=`<span class="batch-sell-item__icon">${iconHtml(i.icon,24,i.quality)}</span><span class="batch-sell-item__name">${i.name}</span>`;
      list.appendChild(el);
    });

    document.getElementById('batchSellConfirm').onclick=()=>{
      // 执行出售
      const ids=new Set(selected.map(i=>i.id));
      d.inventory=d.inventory.filter(i=>!ids.has(i.id));
      d.player.gold+=totalValue;d.stats.totalSold+=selected.length;d.stats.totalEarned+=totalValue;
      BackpackState.clearSelection();GameData.save();Game.refreshAll();
      SFX.play('success');
      document.getElementById('batchSellModal').classList.remove('active');
      UI.showToast(`出售${selected.length}件物品！+💰${formatGold(totalValue)}`);
    };

    document.getElementById('batchSellCancel').onclick=()=>document.getElementById('batchSellModal').classList.remove('active');
    document.getElementById('batchSellModal').addEventListener('click',(e)=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('active');},{once:true});
    document.getElementById('batchSellModal').classList.add('active');
  },

  // ===== 出售物品 =====
  sellItem(id,fromMarket){const d=GameData.data,idx=d.inventory.findIndex(i=>i.id===id);if(idx===-1)return;const item=d.inventory[idx];const negBonus=1+Math.min(d.skills.negotiation*0.1,200)*0.01;const durMult=item.durability/100;const isAppr=item.appraised;const priceMult=isAppr?1:0.5;const fluct=fromMarket?(item._marketFluct||1):1;const finalPrice=Math.max(1,Math.floor(item.price*priceMult*durMult*negBonus*fluct));d.player.gold+=finalPrice;d.inventory.splice(idx,1);d.stats.totalSold++;d.stats.totalEarned+=finalPrice;d.player.exp+=5;DailyTaskSystem.addProgress('sell');GameData.save();Game.refreshAll();SFX.play('success');let msg='出售成功！+💰'+formatGold(finalPrice);if(!isAppr)msg+=' (未鉴定-50%)';if(durMult<1)msg+=' (耐久'+item.durability+'%)';if(fromMarket&&fluct!==1)msg+=' (行情x'+fluct+')';UI.showToast(msg);},

  // ===== 地图选择弹窗 =====
  showMapModal(){SFX.play('click');const d=GameData.data;const hotspots=document.getElementById('mapHotspots');const lines=document.getElementById('mapLines');const detail=document.getElementById('mapDetail');hotspots.innerHTML='';lines.innerHTML='';detail.style.display='none';
// 连线：研究穹顶为中心，连接其他4个
const center=ZONES[2].pos;const connections=[[0,2],[1,2],[2,3],[2,4]];connections.forEach(([a,b])=>{const pa=ZONES[a].pos,pb=ZONES[b].pos;const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',pa.x);line.setAttribute('y1',pa.y);line.setAttribute('x2',pb.x);line.setAttribute('y2',pb.y);line.setAttribute('stroke','rgba(255,200,50,0.6)');line.setAttribute('stroke-width','0.5');line.setAttribute('stroke-dasharray','2,1');lines.appendChild(line);});
// 热点按钮
ZONES.forEach((z,i)=>{const unlocked=d.maps.unlockedMaps.includes(i),active=d.maps.currentMap===i;const btn=document.createElement('div');btn.className='map-hotspot'+(active?' map-hotspot--active':'')+(!unlocked?' map-hotspot--locked':'');btn.style.left=z.pos.x+'%';btn.style.top=z.pos.y+'%';btn.innerHTML=`<div class="map-hotspot__dot"></div><div class="map-hotspot__label">${z.icon} ${z.name}</div>`;btn.addEventListener('click',(e)=>{e.stopPropagation();this._showMapDetail(i);});hotspots.appendChild(btn);});
document.getElementById('mapModal').classList.add('active');},
_showMapDetail(idx){const d=GameData.data,z=ZONES[idx],unlocked=d.maps.unlockedMaps.includes(idx),active=d.maps.currentMap===idx;const detail=document.getElementById('mapDetail');const pos=z.pos;
document.getElementById('mapDetailName').textContent=z.icon+' '+z.name;
document.getElementById('mapDetailStars').textContent='⭐'.repeat(z.stars);
document.getElementById('mapDetailDesc').textContent=z.description;
document.getElementById('mapDetailCost').textContent=z.ticket===0?'免费':'💰 '+formatGold(z.ticket);
document.getElementById('mapDetailLoot').textContent=z.loot||'';
const qualityLabels=z.qualityRange.map(q=>{const qc=QUALITY_CONFIG[q];return`<span style="color:${qc.color}">${qc.label}</span>`;}).join(' ');
document.getElementById('mapDetailQuality').innerHTML=qualityLabels;
// 解锁条件
const unlockRow=document.getElementById('mapDetailUnlockRow');
const unlockEl=document.getElementById('mapDetailUnlock');
if(z.unlockType==='default'){unlockRow.style.display='none';}
else{unlockRow.style.display='flex';let cur=0,total=z.unlockVal;
if(z.unlockType==='stat')cur=d.stats[z.unlockKey]||0;
else if(z.unlockType==='level')cur=d.player.level;
const done=cur>=total;
unlockEl.innerHTML=done?'<span style="color:#00ff64">✅ '+z.unlockDesc+'</span>':('<span style="color:#ff6b6b">'+z.unlockDesc+' ('+cur+'/'+total+')</span>');}
const btn=document.getElementById('mapDetailBtn');
if(!unlocked){btn.textContent='🔒 未解锁';btn.className='btn map-detail__btn map-detail__btn--locked';btn.onclick=null;}
else if(active){btn.textContent='确认进入';btn.className='btn btn--primary map-detail__btn';btn.onclick=()=>{UI._scavengeEntered=true;document.getElementById('mapModal').classList.remove('active');Game.switchTab('scavenge');SFX.play('success');};}
  else{btn.textContent='进入探索';btn.className='btn btn--primary map-detail__btn';btn.onclick=()=>{if(z.ticket>0){if(d.player.gold<z.ticket){UI.showToast('金币不足，需要 '+formatGold(z.ticket));return;}d.player.gold-=z.ticket;UI.showToast('消耗 '+formatGold(z.ticket)+' 进入 '+z.name);}UI._scavengeEntered=true;d.maps.currentMap=idx;DigEngine.resetSession();GameData.save();document.getElementById('mapModal').classList.remove('active');Game.switchTab('scavenge');SFX.play('success');UI.updateStatusBar();};}
// 定位对话框
detail.style.display='block';const isLeft=pos.x<50;detail.style.left=isLeft?(pos.x+5)+'%':'auto';detail.style.right=isLeft?'auto':(100-pos.x+5)+'%';detail.style.top=Math.min(Math.max(pos.y-10,5),55)+'%';detail.style.maxHeight='40vh';detail.style.overflowY='auto';},

  // ===== 探索结算弹窗 =====
  showResultModal(){const s=DigEngine.session;if(!GameData.data.digItems.length)return;SFX.play('success');const d=GameData.data;const sessionItems=[...GameData.data.digItems];let tv=0,bq='civ';sessionItems.forEach(i=>{tv+=i.price;if(QUALITY_CONFIG[i.quality].order>QUALITY_CONFIG[bq].order)bq=i.quality;});document.getElementById('resultTitle').textContent=s.staminaUsed>=10?'十连探索结算':'探索结算';document.getElementById('resultCount').textContent=sessionItems.length;document.getElementById('resultValue').textContent=formatGold(tv);document.getElementById('resultBest').textContent=QUALITY_CONFIG[bq].label;document.getElementById('resultBest').style.color=QUALITY_CONFIG[bq].color;const c=document.getElementById('resultItems');c.innerHTML='';sessionItems.forEach((item,i)=>{const qc=QUALITY_CONFIG[item.quality],el=document.createElement('div');el.className='result-item';el.style.animationDelay=(i*0.08)+'s';el.style.borderColor=qc.color;el.innerHTML=`<span class="result-item__icon">${iconHtml(item.icon,itemIconSize(item.size),item.quality)}</span><span class="result-item__name">${item.name}</span><span class="result-item__quality" style="color:${qc.color}">${qc.label}</span>`;el.addEventListener('click',()=>{document.getElementById('resultModal').classList.remove('active');this.showItemModal(item);});c.appendChild(el);});document.getElementById('resultModal').classList.add('active');},

  // ===== 事件弹窗 =====
  showEventModal(event){document.getElementById('eventIcon').innerHTML=iconHtml(event.icon,32);document.getElementById('eventIcon').className='event-modal__icon '+event.iconClass;document.getElementById('eventTitle').textContent=event.name;document.getElementById('eventDesc').textContent=event.desc;document.getElementById('eventReward').textContent='';const cb=document.getElementById('eventConfirm'),cc=document.getElementById('eventCancel');cb.textContent=event.action;cb.className='btn btn--primary';cb.style.display='';cc.style.display='';cc.textContent='离开';this._eventPending=false;this._eventData=event;document.getElementById('eventModal').classList.add('active');},

  showStaminaModal(){const d=GameData.data;document.getElementById('staminaModalDesc').textContent=`体力已耗尽（${d.player.stamina}/${d.player.maxStamina}），休息一下或看广告恢复`;document.getElementById('staminaModal').classList.add('active');},

  // ===== 交易所页（P4完整实现） =====
  refreshMarket(){
    const d = GameData.data;

    // 更新商品数量和倒计时
    document.getElementById('marketCount').textContent = MarketEngine.items.length;
    const fluctEl=document.getElementById('marketFluctDisplay');
    if(fluctEl){
      const items=GameData.data.inventory;
      if(items.length){
        const avg=items.reduce((s,i)=>s+(i._marketFluct||1),0)/items.length;
        fluctEl.textContent='x'+avg.toFixed(1);
        fluctEl.style.color=avg>=1.1?'var(--color-success)':avg<1?'var(--color-danger)':'var(--text-primary)';
      }
    }
    const remaining = MarketEngine.getTimeRemaining();
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    document.getElementById('marketTimer').textContent = `${m}:${s.toString().padStart(2, '0')}`;

    // 获取当前激活的标签页
    const activeTab = document.querySelector('.market-tabs__item.active');
    const tabName = activeTab ? activeTab.dataset.marketTab : 'sell';

    // 隐藏所有面板，显示当前面板
    const sellPanel = document.getElementById('marketSellPanel');
    const tradePanel = document.getElementById('marketTradePanel');
    const shopPanel = document.getElementById('marketShopPanel');
    if (sellPanel) sellPanel.style.display = tabName === 'sell' ? '' : 'none';
    if (tradePanel) tradePanel.style.display = tabName === 'trade' ? '' : 'none';
    if (shopPanel) shopPanel.style.display = tabName === 'shop' ? '' : 'none';

    // === 出售面板：卡片网格 + 排序 + 分页 ===
    if (tabName === 'sell' && sellPanel) {
      const grid = document.getElementById('marketSellGrid');
      const pagination = document.getElementById('marketPagination');
      const totalEl = document.getElementById('marketTotalValue');
      if (!grid) return;

      const bonus = 1 + d.skills.negotiation * 0.05;
      const ITEMS_PER_PAGE = 12;

      // 总价值预览
      let totalValue = 0;
      d.inventory.forEach(i => {
        const durMult=i.durability/100;
        const isAppr=i.appraised;
        const priceMult=isAppr?1:0.5;
        const fluct=i._marketFluct||1;
        totalValue += Math.max(1,Math.floor(i.price*priceMult*durMult*bonus*fluct));
      });
      if (totalEl) totalEl.textContent = '全部出售可得 💰 ' + formatGold(totalValue);

      if (d.inventory.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:20px 0;font-size:12px;">仓库空空如也</div>';
        if (pagination) pagination.innerHTML = '';
        return;
      }

      // 排序
      const sortType = this._marketSort || 'quality';
      let sorted = [...d.inventory];
      if (sortType === 'quality') sorted.sort((a,b) => QUALITY_CONFIG[b.quality].order - QUALITY_CONFIG[a.quality].order);
      else if (sortType === 'value') sorted.sort((a,b) => b.price - a.price);
      else if (sortType === 'change') sorted.sort((a,b) => (b._change||1) - (a._change||1));

      // 分页
      const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
      const page = Math.min(this._marketPage || 1, totalPages);
      const start = (page - 1) * ITEMS_PER_PAGE;
      const pageItems = sorted.slice(start, start + ITEMS_PER_PAGE);

      // 渲染卡片
      grid.innerHTML = '';
      pageItems.forEach(item => {
        const qc = QUALITY_CONFIG[item.quality];
        const sellPrice = Math.floor(item.price * bonus);
        // 每个物品独立行情波动
        if (!item._marketFluct) item._marketFluct = +(0.8 + Math.random() * 0.7).toFixed(2);
        const change = item._marketFluct;
        const isUp = change >= 1.1, isDown = change < 1;
        const actualPrice = Math.floor(sellPrice * change);

        const el = document.createElement('div');
        el.className = `market-sell-card market-sell-card--${item.quality}`;
        let tags = '';
        if (!item.appraised) tags += '<span class="market-sell-card__tag market-sell-card__tag--unk">未鉴定</span>';
        if (item.damaged) tags += '<span class="market-sell-card__tag market-sell-card__tag--half">受损</span>';

        el.innerHTML = `
          <span class="market-sell-card__icon">${iconHtml(item.icon,itemIconSize(item.size),item.quality)}</span>
          <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;">
            <span class="market-sell-card__name">${item.name}</span>
            ${tags ? `<div class="market-sell-card__tags">${tags}</div>` : ''}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:1px;flex-shrink:0;">
            <span class="market-sell-card__price">💰${formatGold(actualPrice)}</span>
            <span class="market-sell-card__change ${isUp?'market-sell-card__change--up':isDown?'market-sell-card__change--down':''}">${isUp?'▲':isDown?'▼':'●'}x${change}</span>
          </div>
          <button class="btn btn--sm btn--primary market-sell-card__btn">售出</button>
        `;
        el.querySelector('.market-sell-card__btn').addEventListener('click', () => {
          this.sellItem(item.id, true);
        });
        grid.appendChild(el);
      });

      // 分页控件
      if (pagination) {
        if (totalPages <= 1) {
          pagination.innerHTML = '';
        } else {
          pagination.innerHTML = `
            <button class="btn btn--sm btn--primary" ${page<=1?'disabled':''} data-page="${page-1}">上一页</button>
            <span>${page}/${totalPages}</span>
            <button class="btn btn--sm btn--primary" ${page>=totalPages?'disabled':''} data-page="${page+1}">下一页</button>
          `;
          pagination.querySelectorAll('button[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
              this._marketPage = parseInt(btn.dataset.page);
              this.refreshMarket();
            });
          });
        }
      }
    }

    // === 交易面板：交易所商品网格 ===
    if (tabName === 'trade' && tradePanel) {
      const grid = document.getElementById('marketGrid');
      if (!grid) return;
      grid.innerHTML = '';
      if (MarketEngine.items.length === 0) {
        grid.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:40px 0;grid-column:1/-1;">暂无商品</div>';
        return;
      }
      MarketEngine.items.forEach((item, idx) => {
        const qc = QUALITY_CONFIG[item.quality];
        const el = document.createElement('div');
        el.className = `market-item--card market-item--card--${item.quality}`;
        el.innerHTML = `
          <div class="market-item--card__icon">${iconHtml(item.icon,itemIconSize(item.size),item.quality)}</div>
          <div class="market-item--card__name">${item.name}</div>
          <div class="market-item--card__quality quality-tag quality-tag--${item.quality}">${qc.label}</div>
          <div class="market-item--card__price ${item.multiplier > 1.1 ? 'price-up' : item.multiplier < 1 ? 'price-down' : ''}">💰${formatGold(item.price)}</div>
          <button class="btn btn--sm btn--primary market-item--card__btn" ${d.player.gold < item.price ? 'disabled' : ''}>购买</button>
        `;
        el.querySelector('.market-item--card__btn').addEventListener('click', () => {
          SFX.play('click');
          this.showMarketBuyConfirm(idx);
        });
        grid.appendChild(el);
      });

      // 更新收藏家列表
      const collectorList = document.getElementById('collectorList');
      if (collectorList) {
        collectorList.innerHTML = '';
        CollectorNPC.collectors.forEach((c, idx) => {
          const matching = CollectorNPC.getMatchingItems(c);
          const el = document.createElement('div');
          el.className = 'collector-item' + (matching.length > 0 ? ' collector-item--active' : '');
          el.innerHTML = `
            <span class="collector-item__name">${iconHtml(c.icon)} ${c.name}</span>
            <span class="collector-item__want">求购: ${c.wantLabel}</span>
            <span class="collector-item__price">×${c.multiplier} ${matching.length > 0 ? '(' + matching.length + '件)' : ''}</span>
          `;
          el.addEventListener('click', () => {
            SFX.play('click');
            this.showCollectorDetail(idx);
          });
          collectorList.appendChild(el);
        });
      }
    }

    // === 商店面板 ===
    if (tabName === 'shop' && shopPanel) {
      const shopGrid = document.getElementById('shopGrid');
      if (!shopGrid) return;
      shopGrid.innerHTML = '';
      ShopSystem.items.forEach((item, idx) => {
        const el = document.createElement('div');
        el.className = 'shop-item';
        el.innerHTML = `
          <div class="shop-item__icon">${iconHtml(item.icon,itemIconSize(item.size),item.quality)}</div>
          <div class="shop-item__name">${item.name}</div>
          <div class="shop-item__desc">${item.desc}</div>
          <button class="btn btn--sm btn--primary shop-item__btn" ${d.player.gold < item.price ? 'disabled' : ''}>💰${formatGold(item.price)}</button>
        `;
        el.querySelector('.shop-item__btn').addEventListener('click', () => {
          SFX.play('click');
          ShopSystem.buyShopItem(idx);
        });
        shopGrid.appendChild(el);
      });
    }
  },

  // ===== 交易所购买确认弹窗 =====
  showMarketBuyConfirm(index) {
    const item = MarketEngine.items[index];
    if (!item) return;
    const qc = QUALITY_CONFIG[item.quality];
    const d = GameData.data;

    document.getElementById('buyConfirmIcon').innerHTML = iconHtml(item.icon,itemIconSize(item.size,32),item.quality);
    document.getElementById('buyConfirmName').textContent = item.name;
    document.getElementById('buyConfirmQuality').textContent = qc.label + ' · ' + qc.name;
    document.getElementById('buyConfirmQuality').style.color = qc.color;
    document.getElementById('buyConfirmPrice').textContent = '💰 ' + formatGold(item.price);

    const confirmBtn = document.getElementById('buyConfirmBtn');
    confirmBtn.disabled = d.player.gold < item.price;
    confirmBtn.textContent = d.player.gold < item.price ? '金币不足' : '确认购买';
    confirmBtn.onclick = () => {
      MarketEngine.buyItem(index);
      document.getElementById('marketBuyModal').classList.remove('active');
      this.refreshMarket();
    };

    document.getElementById('buyConfirmCancel').onclick = () => document.getElementById('marketBuyModal').classList.remove('active');
    document.getElementById('marketBuyModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('active'); }, {once: true});
    document.getElementById('marketBuyModal').classList.add('active');
  },

  // ===== 收藏家详情弹窗 =====
  showCollectorDetail(index) {
    const collector = CollectorNPC.collectors[index];
    if (!collector) return;
    const matching = CollectorNPC.getMatchingItems(collector);

    document.getElementById('collectorDetailIcon').innerHTML = iconHtml(collector.icon,32);
    document.getElementById('collectorDetailName').textContent = collector.name;
    document.getElementById('collectorDetailWant').textContent = '求购: ' + collector.wantLabel;
    document.getElementById('collectorDetailMultiplier').textContent = '×' + collector.multiplier + ' 高价收购';

    const list = document.getElementById('collectorDetailList');
    list.innerHTML = '';
    if (matching.length === 0) {
      list.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:20px 0;">仓库中没有匹配的物品</div>';
    } else {
      matching.forEach(item => {
        const qc = QUALITY_CONFIG[item.quality];
        const bonus = 1 + GameData.data.skills.negotiation * 0.05;
        const sellPrice = Math.floor(item.price * collector.multiplier * bonus);
        const el = document.createElement('div');
        el.className = 'sell-quick-item';
        el.innerHTML = `
          <span class="sell-quick-item__icon" style="color:${qc.color}">${iconHtml(item.icon,itemIconSize(item.size),item.quality)}</span>
          <span class="sell-quick-item__name">${item.name}</span>
          <span class="sell-quick-item__quality quality-tag quality-tag--${item.quality}">${qc.label}</span>
          <span class="sell-quick-item__price" style="color:var(--color-success)">💰${formatGold(sellPrice)}</span>
        `;
        list.appendChild(el);
      });
    }

    const sellBtn = document.getElementById('collectorDetailSell');
    sellBtn.disabled = matching.length === 0;
    sellBtn.textContent = matching.length > 0 ? `出售最贵的 (${matching.length}件匹配)` : '无匹配物品';
    sellBtn.onclick = () => {
      CollectorNPC.sellToCollector(index);
      document.getElementById('collectorDetailModal').classList.remove('active');
      this.refreshMarket();
    };

    document.getElementById('collectorDetailClose').onclick = () => document.getElementById('collectorDetailModal').classList.remove('active');
    document.getElementById('collectorDetailModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('active'); }, {once: true});
    document.getElementById('collectorDetailModal').classList.add('active');
  },

  // ===== 广告奖励弹窗 =====
  showAdRewardModal(type) {
    const modal = document.getElementById('adRewardModal');
    const typeNames = { refreshMarket: '刷新交易所', doubleSell: '双倍出售', freeAppraise: '免费鉴定' };
    document.getElementById('adRewardIcon').textContent = '📺';
    document.getElementById('adRewardTitle').textContent = '观看广告中...';
    document.getElementById('adRewardDesc').textContent = typeNames[type] || '加载中';
    const btn = document.getElementById('adRewardBtn');
    btn.textContent = '请稍候...';
    btn.style.opacity = '0.5';
    AdSystem.adPlaying = true;
    modal.classList.add('active');
  },

  refreshGrowth(){const d=GameData.data;document.getElementById('playerLevel').textContent='Lv.'+d.player.level;document.getElementById('growthLevel').textContent='Lv.'+d.player.level;const need=d.player.level*100,pct=Math.min(100,(d.player.exp/need)*100);document.getElementById('growthExp').textContent=d.player.exp+'/'+need;document.getElementById('expBar').style.width=pct+'%';const sl=document.getElementById('skillList');sl.innerHTML='';SKILLS.forEach(s=>{const lv=d.skills[s.key];const cost=Math.floor(s.costBase*Math.pow(1.15,lv-1));const maxed=lv>=s.maxLevel;const nextCost=maxed?0:Math.floor(s.costBase*Math.pow(1.15,lv));const div=document.createElement('div');div.className='skill-item';const effectText=s.effectDesc?s.effectDesc(lv):s.desc;const nextEffectText=maxed?'已满级':s.effect?s.effect(lv+1):'';div.innerHTML=`<div class="skill-item__info"><span class="skill-item__name">${s.icon||''} ${s.name}</span><span class="skill-item__level">Lv.${lv} · ${effectText}${!maxed?' → <small style="color:var(--color-success)">Lv.'+(lv+1)+' '+nextEffectText+'</small>':''}</span></div><button class="btn btn--sm btn--primary skill-item__btn" ${maxed||d.player.gold<cost?'disabled':''}>${maxed?'已满级':'💰'+formatGold(cost)}</button>`;if(!maxed)div.querySelector('button').addEventListener('click',()=>this.upgradeSkill(s.key,cost));sl.appendChild(div);});document.getElementById('statLooted').textContent=d.stats.totalLooted;document.getElementById('statAppraised').textContent=d.stats.totalAppraised;document.getElementById('statSold').textContent=d.stats.totalSold;document.getElementById('statEarned').textContent=formatGold(d.stats.totalEarned);},

  upgradeSkill(k,c){const d=GameData.data;if(d.player.gold<c){this.showToast('金币不足！');return;}d.player.gold-=c;d.skills[k]++;if(k==='stamina')d.player.maxStamina=100+(d.skills.stamina-1)*2;GameData.save();this.refreshGrowth();UI.updateStatusBar();SFX.play('legend');this.showToast('升级成功！');},

  showToast(msg){const ex=document.querySelector('.toast');if(ex)ex.remove();const t=document.createElement('div');t.className='toast';t.textContent=msg;t.style.cssText='position:fixed;top:80px;left:50%;transform:translateX(-50%);background:var(--bg-secondary);color:var(--text-primary);border:1px solid var(--border-primary);padding:8px 16px;border-radius:4px;font-size:13px;z-index:200;animation:fadeIn 0.2s ease;pointer-events:none;';document.body.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity 0.3s ease';setTimeout(()=>t.remove(),300);},1500);},

  // ===== 门票和营业状态 =====
  updateBizStatus(){
    const d=GameData.data;
    const m=d.museum;
    const btn=document.getElementById('btnToggleBiz');
    const timeEl=document.getElementById('bizTimeLeft');
    if(!btn||!timeEl)return;

    // 日期重置检查
    const today=new Date().toDateString();
    if(m.lastBizDate!==today){
      m.bizHoursUsed=0;
      m.lastBizDate=today;
      m.isBizOpen=false;
      GameData.save();
    }

    const used=m.bizHoursUsed||0;
    const left=Math.max(0,MuseumEngine.MAX_BIZ_HOURS-used);
    timeEl.textContent=used.toFixed(1)+'h/'+MuseumEngine.MAX_BIZ_HOURS+'h';

    if(m.isBizOpen){
      btn.textContent='停止营业';
      btn.className='btn btn--danger btn--sm';
      btn.disabled=false;
    }else{
      btn.textContent=left>0?'开始营业':'今日已满';
      btn.className='btn btn--primary btn--sm';
      btn.disabled=left<=0;
    }

    // 更新门票选中状态 & 动态价格
    const score=MuseumEngine.calcScore();
    const scoreMult=1+score/500;
    document.querySelectorAll('.ticket-opt').forEach(b=>{
      const basePrice=parseInt(b.dataset.price);
      const actualPrice=basePrice>0?Math.floor(basePrice*scoreMult):0;
      b.classList.toggle('active',actualPrice===(m.ticketPrice||30));
      // 更新按钮显示价格
      const priceText=actualPrice>0?'💰'+formatGold(actualPrice):'免费';
      const multText=basePrice===0?'客流×2':basePrice<=10?'较多':basePrice<=30?'推荐':basePrice<=80?'较少':'稀少';
      b.innerHTML=priceText+'<br><small>'+multText+'</small>';
      b.dataset.actualPrice=actualPrice;
    });
  },
  _updateMuseumDisplay(){
    const m=GameData.data.museum;
    const vEl=document.getElementById('dailyVisitors');
    const iEl=document.getElementById('dailyIncome');
    const sEl=document.getElementById('museumScore');
    const rEl=document.getElementById('visitorRate');
    if(vEl)vEl.textContent=m.dailyVisitors+' 人';
    if(iEl)iEl.textContent='💰 '+formatGold(m.dailyIncome);
    if(sEl)sEl.textContent=MuseumEngine.calcScore()+' 分';
    // 客流速率预览
    if(rEl){
      const rate=MuseumEngine.getVisitorRate();
      const perSec=(rate/3600);
      rEl.textContent=perSec>=1?perSec.toFixed(1)+' 人/s':perSec.toFixed(2)+' 人/s';
    }
  },
};

// ========== 初始化 ==========
function init(){
  GameData.load();
  // 离线体力恢复
  const d=GameData.data,now=Date.now(),last=d.staminaRecovery.lastRecoveryTime||now,elapsed=now-last;
  if(elapsed>=60000&&d.player.stamina<d.player.maxStamina){const pts=Math.min(Math.floor(elapsed/60000),d.player.maxStamina-d.player.stamina);d.player.stamina+=pts;d.staminaRecovery.lastRecoveryTime=now;GameData.save();}
  StaminaSystem.startTimer();

  // 底部导航
  document.querySelectorAll('.bottom-nav__item').forEach(i=>i.addEventListener('click',()=>Game.switchTab(i.dataset.tab)));

  // 物品弹窗关闭
  document.getElementById('modalClose').addEventListener('click',()=>document.getElementById('itemModal').classList.remove('active'));
  document.getElementById('modalCloseBtn').addEventListener('click',()=>document.getElementById('itemModal').classList.remove('active'));
  document.getElementById('itemModal').addEventListener('click',(e)=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('active');});

  // 探索按钮
  document.getElementById('btnDigSingle').addEventListener('click',()=>{SFX.init();const d=GameData.data;if(d.player.stamina<1){UI.showStaminaModal();return;}DigEngine.resetSession();DigEngine.digCell();});
  document.getElementById('btnDigTen').addEventListener('click',()=>{SFX.init();const d=GameData.data;if(d.player.stamina<10){UI.showStaminaModal();return;}DigEngine.digTen();});

  // 放入仓库按钮
  document.getElementById('btnDigToWarehouse').addEventListener('click',()=>{
    SFX.play('click');
    const d=GameData.data;
    if(d.digItems.length===0){UI.showToast('探索背包是空的');return;}
    // 按品质统计
    const stats={};
    d.digItems.forEach(item=>{
      const q=(item.quality||'civ').toUpperCase();
      stats[q]=(stats[q]||0)+1;
    });
    const count=d.digItems.length;
    // 放入仓库
    d.digItems.forEach(item=>{
      d.inventory.push(item);
      d.stats.totalLooted++;
    });
    d.digItems=[];
    GameData.save();
    UI.updateDigBackpack();
    // 显示统计弹窗
    const qualityOrder=['MYT','LEG','EPI','RAR','UPG','CIV'];
    const qualityNames={MYT:'神话',LEG:'传说',EPI:'史诗',RAR:'精良',UPG:'优良',CIV:'民用'};
    const qualityColors={MYT:'#ef4444',LEG:'#f59e0b',EPI:'#a855f7',RAR:'#3b82f6',UPG:'#22c55e',CIV:'#6b7280'};
    let statsHtml='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:6px;margin:8px 0;">';
    qualityOrder.forEach(q=>{
      if(!stats[q])return;
      statsHtml+=`<div style="text-align:center;padding:6px;border-radius:6px;background:rgba(255,255,255,0.05);border:1px solid ${qualityColors[q]}33;">
        <div style="font-size:16px;font-weight:700;color:${qualityColors[q]};">${stats[q]}</div>
        <div style="font-size:10px;color:var(--text-secondary);">${qualityNames[q]}</div>
      </div>`;
    });
    statsHtml+='</div>';
    document.getElementById('statsBody').innerHTML=`
      <div style="text-align:center;margin-bottom:8px;">
        <div style="font-size:24px;font-weight:700;color:var(--color-primary);">${count}</div>
        <div style="font-size:12px;color:var(--text-secondary);">本次探索物品</div>
      </div>
      ${statsHtml}
      <button class="btn btn--primary btn--block" style="margin-top:8px;" onclick="document.getElementById('statsModal').classList.remove('active');Game.switchTab('backpack');">确认</button>`;
    document.getElementById('statsModal').classList.add('active');
    SFX.play('success');
  });

  // 升级探索背包按钮
  document.getElementById('btnUpgradeDigBP').addEventListener('click',()=>{
    const d=GameData.data;
    if(d.digBackpack.level>=5){UI.showToast('已满级');return;}
    const next=DIG_BACKPACK_LEVELS[d.digBackpack.level];
    if(d.player.gold<next.upgradeCost){UI.showToast('金币不足，需要'+formatGold(next.upgradeCost));return;}
    d.player.gold-=next.upgradeCost;
    d.digBackpack.level++;
    GameData.save();
    UI.updateDigBackpack();
    UI.updateStatusBar();
    SFX.play('success');
    UI.showToast('探索背包升级到 Lv.'+d.digBackpack.level+'！');
  });

  // 提取门票收入
  document.getElementById('btnCollectIncome').addEventListener('click',()=>{
    const d=GameData.data;
    const m=d.museum;
    if(m.dailyIncome<=0){UI.showToast('暂无可提取收入');return;}
    const amount=m.dailyIncome;
    d.player.gold+=amount;
    m.dailyIncome=0;
    GameData.save();
    SFX.play('coin');
    UI.showToast('提取成功！+'+formatGold(amount));
    UI.updateStatusBar();
    UI._updateMuseumDisplay();
  });

  // 门票价格选择
  document.querySelectorAll('.ticket-opt').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.ticket-opt').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const d=GameData.data;
      const actualPrice=parseInt(btn.dataset.actualPrice||btn.dataset.price);
      d.museum.ticketPrice=actualPrice;
      d.museum.ticketMult=parseFloat(btn.dataset.mult);
      GameData.save();
      SFX.play('click');
    });
  });

  // 营业开关
  document.getElementById('btnToggleBiz').addEventListener('click',()=>{
    const d=GameData.data;
    const m=d.museum;
    if(m.isBizOpen){
      // 关闭营业
      MuseumEngine.tickBusiness();
      m.isBizOpen=false;
      GameData.save();
      SFX.play('click');
      UI.showToast('已停止营业');
    }else{
      // 开启营业
      if(m.bizHoursUsed>=MuseumEngine.MAX_BIZ_HOURS){
        UI.showToast('今日营业时间已用完（8小时）');
        return;
      }
      // 检查日期重置
      const today=new Date().toDateString();
      if(m.lastBizDate!==today){
        m.bizHoursUsed=0;
        m.lastBizDate=today;
      }
      m.isBizOpen=true;
      m.bizStartTime=Date.now();
      GameData.save();
      SFX.play('success');
      UI.showToast('开始营业！');
    }
    UI.updateBizStatus();
  });

  // 每日任务弹窗
  document.getElementById('btnDailyTask').addEventListener('click',()=>{
    SFX.play('click');
    const body=document.getElementById('dailyTaskBody');
    body.innerHTML='';
    const tasks=DailyTaskSystem.TASKS;
    const d=GameData.data;
    let html='<div class="task-list">';
    tasks.forEach(t=>{
      const prog=d.dailyTasks[t.key]||0;
      const done=prog>=t.target;
      const claimed=d.dailyTasks.claimed&&d.dailyTasks.claimed[t.key];
      let statusHtml;
      if(claimed){
        statusHtml=`<span class="task-item__status task-item__status--done">✅ 已领</span>`;
      }else if(done){
        statusHtml=`<button class="task-item__status task-item__status--claim" data-task="${t.key}">领取</button>`;
      }else{
        statusHtml=`<span class="task-item__status task-item__status--pending">进行中</span>`;
      }
      html+=`<div class="task-item ${claimed?'task-item--claimed':''}">
        <span class="task-item__text">${t.name} <small style="color:var(--color-gold);font-weight:400;">+⚡${t.reward}</small></span>
        <span class="task-item__progress">${Math.min(prog,t.target)}/${t.target}</span>
        ${statusHtml}
      </div>`;
    });
    html+='</div>';
    body.innerHTML=html;
    // 绑定领取按钮
    body.querySelectorAll('.task-item__status--claim').forEach(btn=>{
      btn.addEventListener('click',()=>{
        DailyTaskSystem.claimTask(btn.dataset.task);
        const task=DailyTaskSystem.TASKS.find(t=>t.key===btn.dataset.task);
        SFX.play('coin');
        UI.showToast('领取成功！+⚡'+task.reward);
        UI.updateStatusBar();
        // 重新渲染弹窗
        document.getElementById('btnDailyTask').click();
      });
    });
    document.getElementById('dailyTaskModal').classList.add('active');
  });

  // 玩家信息弹窗（含统计）
  document.getElementById('btnPlayerInfo').addEventListener('click',()=>{
    SFX.play('click');
    const d=GameData.data;
    const need=d.player.level*100;
    const pct=Math.min(100,(d.player.exp/need)*100);
    document.getElementById('playerInfoBody').innerHTML=`
      <div class="player-card" style="padding:0;border:none;background:none;">
        <div class="player-card__row"><span>等级</span><span>Lv.${d.player.level}</span></div>
        <div class="player-card__row"><span>经验</span><span>${d.player.exp}/${need}</span></div>
        <div class="progress-bar" style="margin:4px 0 8px;"><div class="progress-bar__fill" style="width:${pct}%"></div></div>
        <div class="player-card__row"><span>体力</span><span>⚡ ${d.player.stamina}/${d.player.maxStamina}</span></div>
        <div class="player-card__row"><span>金币</span><span style="color:var(--color-gold);">💰 ${formatGold(d.player.gold)}</span></div>
      </div>
      <div style="margin-top:10px;font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">📊 数据统计</div>
      <div class="stats-grid">
        <div class="stats-item"><span class="stats-item__value">${d.stats.totalLooted}</span><span class="stats-item__label">已探索</span></div>
        <div class="stats-item"><span class="stats-item__value">${d.stats.totalAppraised}</span><span class="stats-item__label">已鉴定</span></div>
        <div class="stats-item"><span class="stats-item__value">${d.stats.totalSold}</span><span class="stats-item__label">已出售</span></div>
        <div class="stats-item"><span class="stats-item__value">${formatGold(d.stats.totalEarned)}</span><span class="stats-item__label">总收入</span></div>
      </div>`;
    document.getElementById('playerInfoModal').classList.add('active');
  });

  // 技能升级弹窗
  document.getElementById('btnSkills').addEventListener('click',()=>{
    SFX.play('click');
    const d=GameData.data;
    const body=document.getElementById('skillsBody');
    let html='<div class="skill-list">';
    SKILLS.forEach(s=>{
      const lv=d.skills[s.key],cost=s.costBase*lv,maxed=lv>=s.maxLevel;
      html+=`<div class="skill-item"><div class="skill-item__info"><span class="skill-item__name">${s.name}</span><span class="skill-item__level">Lv.${lv}/${s.maxLevel} · ${s.desc}</span></div><button class="btn btn--sm btn--primary skill-item__btn" data-skill="${s.key}" data-cost="${cost}" ${maxed||d.player.gold<cost?'disabled':''}>${maxed?'已满级':'💰'+formatGold(cost)}</button></div>`;
    });
    html+='</div>';
    body.innerHTML=html;
    body.querySelectorAll('.skill-item__btn:not([disabled])').forEach(btn=>{
      btn.addEventListener('click',()=>{
        UI.upgradeSkill(btn.dataset.skill,parseInt(btn.dataset.cost));
        document.getElementById('btnSkills').click();
      });
    });
    document.getElementById('skillsModal').classList.add('active');
  });

  // 排行榜弹窗（占位）
  document.getElementById('btnRank').addEventListener('click',()=>{
    SFX.play('click');
    document.getElementById('statsBody').innerHTML='<div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:13px;">🏆 排行榜功能开发中...</div>';
    document.getElementById('statsModal').classList.add('active');
  });

  // 地图选择
  document.getElementById('btnMapSelect').addEventListener('click',()=>UI.showMapModal());
  document.getElementById('mapModalClose').addEventListener('click',()=>{document.getElementById('mapModal').classList.remove('active');Game.switchTab('home');});
  document.getElementById('mapDetailClose').addEventListener('click',()=>{document.getElementById('mapDetail').style.display='none';});
  document.getElementById('mapModal').addEventListener('click',(e)=>{if(e.target===e.currentTarget){e.currentTarget.classList.remove('active');Game.switchTab('home');}});

  // 结算弹窗 - 事件委托
  document.getElementById('resultModal').addEventListener('click',(e)=>{
    if(e.target===e.currentTarget){e.currentTarget.classList.remove('active');return;}
    if(e.target.id==='resultContinue'||e.target.closest('#resultContinue')){e.currentTarget.classList.remove('active');return;}
    if(e.target.id==='resultClose'||e.target.closest('#resultClose')){e.currentTarget.classList.remove('active');return;}
  });

  // 事件弹窗 - 事件委托
  document.getElementById('eventModal').addEventListener('click',(e)=>{
    if(e.target===e.currentTarget){e.currentTarget.classList.remove('active');return;}
    const cb=document.getElementById('eventConfirm'),cc=document.getElementById('eventCancel');
    // 取消按钮（或已执行后的"确定"按钮）
    if(e.target===cc||e.target.closest('#eventCancel')){
      e.currentTarget.classList.remove('active');
      if(UI._eventPending){UI._eventPending=false;GameData.save();Game.refreshAll();}
      return;
    }
    // 确认按钮（执行事件）
    if((e.target===cb||e.target.closest('#eventConfirm'))&&cb.style.display!=='none'){
      SFX.play('click');
      const event=UI._eventData;
      if(!event)return;
      const r=event.execute();
      document.getElementById('eventReward').textContent=r.message;
      document.getElementById('eventReward').style.color=r.type==='loss'?'var(--color-danger)':r.type==='item'&&r.item?QUALITY_CONFIG[r.item.quality].color:'var(--color-gold)';
      cb.style.display='none';
      cc.textContent='确定';
      UI._eventPending=true;
      return;
    }
  });

  // 体力不足弹窗
  document.getElementById('staminaAdBtn').addEventListener('click',()=>{StaminaSystem.recoverByAd();document.getElementById('staminaModal').classList.remove('active');});
  document.getElementById('staminaCloseBtn').addEventListener('click',()=>document.getElementById('staminaModal').classList.remove('active'));
  document.getElementById('staminaModal').addEventListener('click',(e)=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('active');});

  // ===== P3: 背包增强绑定 =====

  // 分类标签
  document.querySelectorAll('#backpackTabs .backpack-tabs__item').forEach(tab=>{
    tab.addEventListener('click',()=>{
      SFX.play('click');
      document.querySelectorAll('#backpackTabs .backpack-tabs__item').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      BackpackState.filter=tab.dataset.filter;
      BackpackState.clearSelection();
      UI.refreshBackpack();
    });
  });

  // 排序下拉
  document.getElementById('btnSort').addEventListener('click',(e)=>{
    e.stopPropagation();
    SFX.play('click');
    const dd=document.getElementById('sortDropdown');
    dd.classList.toggle('active');
  });

  document.querySelectorAll('#sortDropdown .filter-dropdown__item').forEach(item=>{
    item.addEventListener('click',()=>{
      SFX.play('click');
      document.querySelectorAll('#sortDropdown .filter-dropdown__item').forEach(i=>i.classList.remove('active'));
      item.classList.add('active');
      BackpackState.sort=item.dataset.sort;
      document.getElementById('sortDropdown').classList.remove('active');
      UI.refreshBackpack();
    });
  });

  // 点击其他地方关闭下拉
  document.addEventListener('click',()=>document.getElementById('sortDropdown').classList.remove('active'));

  // 多选模式
  document.getElementById('btnMultiSelect').addEventListener('click',()=>{
    SFX.play('click');
    BackpackState.multiSelect=!BackpackState.multiSelect;
    if(!BackpackState.multiSelect)BackpackState.clearSelection();
    UI.refreshBackpack();
  });

  // 批量出售
  document.getElementById('btnBatchSell').addEventListener('click',()=>{
    SFX.play('click');
    UI.showBatchSellModal();
  });

  // 取消多选
  document.getElementById('btnCancelSelect').addEventListener('click',()=>{
    SFX.play('click');
    BackpackState.clearSelection();
    UI.refreshBackpack();
  });

  // 底部一键按钮
  document.getElementById('btnBatchAppraiseBottom').addEventListener('click',()=>{SFX.play('click');UI.batchAppraise();});
  document.getElementById('btnBatchRepairBottom').addEventListener('click',()=>{SFX.play('click');UI.batchRepair();});

  // 签到按钮 -> 弹窗
  document.getElementById('btnSignIn').addEventListener('click',()=>{
    SFX.play('click');
    const body=document.getElementById('signInBody');
    const d=GameData.data;
    const streak=d.signIn.streak||0;
    const today=new Date().toDateString();
    const signed=d.signIn.lastDate===today;
    const rewards=SignInSystem.REWARDS;
    const labels=['💰100','💰150','💰200','💰300','💰500','💰800','💰1000','💰1500','💰2000','💰3000','💰5000'];
    let html='<div style="text-align:center;margin-bottom:8px;font-size:12px;color:var(--text-secondary);">连续签到 <span style="color:var(--color-gold);font-weight:600;">'+streak+'</span> 天</div>';
    html+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">';
    for(let i=0;i<7;i++){
      const isCurrent=i===streak%7;
      const isPast=i<(streak%7);
      const reward=labels[i]||'💰'+rewards[i];
      let bg=isPast?'rgba(34,197,94,0.15)':isCurrent&&!signed?'rgba(59,130,246,0.15)':'var(--bg-tertiary)';
      let border=isPast?'1px solid rgba(34,197,94,0.4)':isCurrent&&!signed?'1px solid var(--color-primary)':'1px solid var(--border-primary)';
      let icon=isPast?'✅':isCurrent&&!signed?'👉':'';
      html+=`<div style="background:${bg};border:${border};border-radius:8px;padding:8px 4px;text-align:center;font-size:10px;">
        <div style="font-size:9px;color:var(--text-secondary);margin-bottom:2px;">第${i+1}天</div>
        <div style="font-size:12px;font-weight:600;color:var(--color-gold);margin-bottom:2px;">${reward}</div>
        <div>${icon}</div>
      </div>`;
    }
    html+='</div>';
    html+=`<button class="btn btn--primary" id="btnDoSignIn" style="width:100%;margin-top:12px;" ${signed?'disabled':''}>${signed?'✅ 今日已签到':'立即签到（+'+labels[streak%7]+'）'}</button>`;
    body.innerHTML=html;
    document.getElementById('signInModal').classList.add('active');
    const doBtn=document.getElementById('btnDoSignIn');
    if(doBtn&&!signed){
      doBtn.addEventListener('click',()=>{
        SignInSystem.signIn();
        document.getElementById('signInModal').classList.remove('active');
      });
    }
  });

  // 博物馆按钮
  document.getElementById('btnMuseum').addEventListener('click',()=>{SFX.play('click');UI.showMuseumModal();});

  // 成就按钮
  document.getElementById('btnAchievement').addEventListener('click',()=>{SFX.play('click');UI.showAchievementModal();});

  // 博物馆/成就弹窗点击遮罩关闭
  document.getElementById('museumModal').addEventListener('click',(e)=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('active');});
  document.getElementById('achievementModal').addEventListener('click',(e)=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('active');});

  // 交易所标签（P4增强：带面板切换）
  document.querySelectorAll('.market-tabs__item').forEach(t=>{
    t.addEventListener('click',()=>{
      SFX.play('click');
      document.querySelectorAll('.market-tabs__item').forEach(i=>i.classList.remove('active'));
      t.classList.add('active');
      UI._marketPage=1;
      UI.refreshMarket();
    });
  });

  // 出售面板排序按钮
  document.querySelectorAll('.market-sort__item').forEach(btn=>{
    btn.addEventListener('click',()=>{
      SFX.play('click');
      document.querySelectorAll('.market-sort__item').forEach(i=>i.classList.remove('active'));
      btn.classList.add('active');
      UI._marketSort=btn.dataset.sort;
      UI._marketPage=1;
      UI.refreshMarket();
    });
  });

  // P4: 初始化交易所
  MarketEngine.refresh();
  MarketEngine.startTimer();

  // 博物馆每日重置 + 访客定时器（每60秒）
  MuseumEngine.dailyReset();
  DailyTaskSystem.checkReset();
  setInterval(()=>{MuseumEngine.tickVisitors();if(Game.currentTab==='home')UI._updateMuseumDisplay();},1000);

  // P4: 刷新行情按钮
  document.getElementById('btnRefreshMarket').addEventListener('click',()=>{
    const remaining=MarketEngine.getTimeRemaining();
    if(remaining>0){UI.showToast('行情冷却中，还需 '+remaining+' 秒');return;}
    SFX.play('click');
    MarketEngine.refreshFluct();
    MarketEngine.refresh();
    UI.refreshMarket();
    UI.showToast('行情已刷新！每件物品独立波动');
  });

  // P4: 全部出售按钮
  document.getElementById('btnSellAll').addEventListener('click',()=>{
    SFX.play('click');
    const d = GameData.data;
    if(d.inventory.length === 0){UI.showToast('仓库是空的');return;}
    const negBonus = 1 + d.skills.negotiation * 0.05;
    let totalValue = 0;
    d.inventory.forEach(i => {
      const durMult=i.durability/100;
      const priceMult=i.appraised?1:0.5;
      const fluct=i._marketFluct||1;
      totalValue += Math.max(1,Math.floor(i.price * priceMult * durMult * negBonus * fluct));
    });
    const count=d.inventory.length;
    d.player.gold += totalValue;
    d.stats.totalSold += count;
    d.stats.totalEarned += totalValue;
    d.inventory = [];
    GameData.save();
    Game.refreshAll();
    SFX.play('coin');
    UI.showToast(`全部出售！${count}件 +💰${formatGold(totalValue)}`);
  });

  // P4: 广告按钮 - 刷新交易所
  document.getElementById('btnAdRefresh').addEventListener('click',()=>{
    SFX.play('click');
    AdSystem.watchAd('refreshMarket');
  });

  // P4: 广告按钮 - 双倍出售
  const btnAdDouble=document.getElementById('btnAdDouble');if(btnAdDouble)btnAdDouble.addEventListener('click',()=>{
    SFX.play('click');
    AdSystem.watchAd('doubleSell');
  });

  // P4: 广告奖励弹窗 - 点击任意位置关闭（广告播放完后）
  document.getElementById('adRewardModal').addEventListener('click',()=>{
    if (AdSystem.adPlaying) return; // 广告还没播完，忽略点击
    document.getElementById('adRewardModal').classList.remove('active');
    SFX.play('success');
  });

  Game.refreshAll();
  console.log('搜刮大师 v0.4 P4 交易系统加载完成');
}

document.addEventListener('DOMContentLoaded',init);
