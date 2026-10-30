const ART = Object.freeze({
  background: '',
  crest: '',
});

const PRESETS = Object.freeze({
  explorer: Object.freeze({ farmers: 4, difficulty: 0.75, firstDelay: 45, restSeconds: 21 }),
  balanced: Object.freeze({ farmers: 3, difficulty: 1, firstDelay: 23, restSeconds: 14 }),
  warrior: Object.freeze({ farmers: 2, difficulty: 1.35, firstDelay: 18, restSeconds: 11 }),
});

const TEXT = Object.freeze({
  en: {
    tag: 'THE REALM AWAITS', titleTop: 'SHADOW', titleBottom: 'REALMS', subtitle: 'Rise · Build · Defend',
    quick: 'Quick Game', custom: 'Custom Game', guide: 'How to Play', options: 'Game Options',
    credits: 'About the Realm', exit: 'Back to Games', quickNote: 'Start a balanced battle',
    customNote: 'Choose your starting challenge', guideNote: 'Learn the basics',
    optionsNote: 'Display & accessibility', creditsNote: 'Explore the world', exitNote: 'Return to Shadow',
    corner: 'LOCAL STRATEGY · EARLY ACCESS', stamp: 'CHOOSE YOUR PATH',
    setupTitle: 'Prepare Your Realm', setupIntro: 'Choose how your first battle begins.',
    explorer: 'Explorer', explorerSub: '4 farmers · More time to prepare · Lighter waves',
    balanced: 'Defender', balancedSub: '3 farmers · Standard enemy waves',
    warrior: 'Warrior', warriorSub: '2 farmers · Faster and stronger enemy waves',
    start: 'Enter the Realm', back: 'Back to Menu',
    guideTitle: 'Your First Steps', guideIntro: 'Your village is already waiting. Try these actions:',
    step1: 'Select a farmer by clicking or tapping the character.',
    step2: 'Use the command footer to farm rice, chop wood or move.',
    step3: 'Construct buildings, recruit defenders and protect your base.',
    step4: 'Follow mission objectives and survive enemy waves.',
    tip: 'On desktop, right-click the world to move a selected unit. On touch, use the on-screen controls.',
    optionsTitle: 'Game Options', motion: 'Reduce animations', motionHelp: 'Limits decorative menu motion and gameplay effects.',
    optionsInfo: 'Game progress is currently kept in this browser session. This prototype has no save/load yet.',
    aboutTitle: 'A Realm of Your Own', aboutBody: 'Grow a village, explore the frontier, train your defenders and survive a hostile world. Shadow Realms is an evolving local strategy prototype.',
    aboutFoot: 'All artwork slots can be replaced later without changing the gameplay engine.',
    live: 'No account or server required to start the battle',
  },
  km: {
    tag: 'ពិភពថ្មីកំពុងរង់ចាំ', titleTop: 'SHADOW', titleBottom: 'REALMS', subtitle: 'កសាង · រុករក · ការពារ',
    quick: 'ចាប់ផ្តើមលឿន', custom: 'កំណត់ហ្គេម', guide: 'របៀបលេង', options: 'ការកំណត់ហ្គេម',
    credits: 'អំពីពិភពហ្គេម', exit: 'ត្រឡប់ទៅ Game', quickNote: 'ចាប់ផ្តើមលេងតាមកម្រិតធម្មតា',
    customNote: 'ជ្រើសកម្រិតចាប់ផ្តើម', guideNote: 'រៀនបញ្ជាជំហានដំបូង',
    optionsNote: 'ចលនា និងភាពងាយស្រួល', creditsNote: 'ស្វែងយល់ពីពិភព Shadow', exitNote: 'ត្រឡប់ទៅបញ្ជីហ្គេម',
    corner: 'ហ្គេមក្នុង Browser · កំណែសាកល្បង', stamp: 'ជ្រើសរើសដំណើររបស់អ្នក',
    setupTitle: 'ត្រៀមចូលពិភពហ្គេម', setupIntro: 'ជ្រើសកម្រិតដែលអ្នកចង់ចាប់ផ្តើម។',
    explorer: 'អ្នករុករក', explorerSub: 'កសិករ 4 · ពេលត្រៀមច្រើន · សត្រូវស្រាល',
    balanced: 'អ្នកការពារ', balancedSub: 'កសិករ 3 · រលកសត្រូវកម្រិតធម្មតា',
    warrior: 'អ្នកចម្បាំង', warriorSub: 'កសិករ 2 · សត្រូវខ្លាំង និងមកលឿន',
    start: 'ចូលលេងហ្គេម', back: 'ត្រឡប់ទៅ Menu',
    guideTitle: 'ជំហានលេងដំបូង', guideIntro: 'អ្នកអាចសាកល្បងសកម្មភាពទាំងនេះ៖',
    step1: 'ចុចលើកសិករ ដើម្បីជ្រើសរើសតួអង្គ។',
    step2: 'ប្រើ Footer ដើម្បីដាំស្រូវ កាប់ឈើ ឬបញ្ជាផ្លាស់ទី។',
    step3: 'សាងសង់អគារ បង្កើតទាហាន និងការពារមូលដ្ឋាន។',
    step4: 'ធ្វើបេសកកម្ម និងទប់ទល់រលកសត្រូវ។',
    tip: 'លើកុំព្យូទ័រ ចុច Mouse ស្ដាំ ដើម្បីបញ្ជាតួអង្គផ្លាស់ទី។ លើទូរសព្ទ ប្រើប៊ូតុងនៅអេក្រង់។',
    optionsTitle: 'ការកំណត់ហ្គេម', motion: 'កាត់បន្ថយចលនា', motionHelp: 'បន្ថយចលនា Menu និង Effect ក្នុងហ្គេម។',
    optionsInfo: 'បច្ចុប្បន្នហ្គេមរក្សាដំណើរការតែក្នុងការបើកលេងនេះ មិនទាន់មាន Save/Load ទេ។',
    aboutTitle: 'ពិភពដែលអ្នកបង្កើត', aboutBody: 'ដាំដុះ រុករក សាងសង់ និងបង្កើតកងការពារ។ Shadow Realms ជាហ្គេមយុទ្ធសាស្ត្រកំពុងអភិវឌ្ឍ។',
    aboutFoot: 'អ្នកអាចដាក់រូបភាព និង Logo ផ្ទាល់ខ្លួនតាមក្រោយបាន ដោយមិនប៉ះ Game Engine។',
    live: 'ចាប់ផ្តើមហ្គេមបានដោយមិនចាំបាច់ប្រើ Backend',
  },
  zh: {
    tag: '新的领域正在等待', titleTop: 'SHADOW', titleBottom: 'REALMS', subtitle: '崛起 · 建造 · 守护',
    quick: '快速游戏', custom: '自定义游戏', guide: '玩法教程', options: '游戏设置', credits: '关于游戏', exit: '返回游戏列表',
    quickNote: '开始标准战斗', customNote: '选择初始挑战', guideNote: '学习基本操作', optionsNote: '动画和无障碍', creditsNote: '探索这个世界', exitNote: '返回 Shadow',
    corner: '本地策略 · 早期体验', stamp: '选择你的道路', setupTitle: '准备你的领地', setupIntro: '选择开局模式。',
    explorer: '探索者', explorerSub: '4位农民 · 更多准备时间 · 较弱敌人', balanced: '守卫者', balancedSub: '3位农民 · 标准敌人', warrior: '战士', warriorSub: '2位农民 · 更快更强的敌人',
    start: '进入领域', back: '返回菜单', guideTitle: '开始游戏', guideIntro: '尝试以下操作：',
    step1: '点击角色选择农民。', step2: '使用底部命令栏种植、伐木或移动。', step3: '建造建筑、训练守卫并保护基地。', step4: '完成任务，抵御敌人的进攻。',
    tip: '电脑上右键点击地图移动选中的单位；触摸设备请使用屏幕控制。', optionsTitle: '游戏设置', motion: '减少动画', motionHelp: '减少菜单动画和游戏特效。',
    optionsInfo: '当前没有存档和读档功能；游戏进度仅在本次运行中保留。', aboutTitle: '属于你的领域', aboutBody: '种植、探索、建造和防守。Shadow Realms 正在开发中。',
    aboutFoot: '之后可以更换专属美术素材，而无需修改游戏引擎。', live: '无需后台服务即可开始',
  },
  ja: {
    tag: '新しい世界が待っている', titleTop: 'SHADOW', titleBottom: 'REALMS', subtitle: '育成 · 建設 · 防衛',
    quick: 'クイックゲーム', custom: 'カスタムゲーム', guide: '遊び方', options: 'ゲーム設定', credits: 'ゲームについて', exit: 'ゲーム一覧へ',
    quickNote: '標準の戦いを開始', customNote: '開始条件を選択', guideNote: '基本操作を学ぶ', optionsNote: '表示とアクセシビリティ', creditsNote: '世界を知る', exitNote: 'Shadow に戻る',
    corner: 'ローカル戦略 · 早期版', stamp: '道を選ぼう', setupTitle: '戦いの準備', setupIntro: '開始モードを選んでください。',
    explorer: '探索者', explorerSub: '農民4人 · 準備時間が長い · 敵は弱め', balanced: '守護者', balancedSub: '農民3人 · 標準の敵', warrior: '戦士', warriorSub: '農民2人 · 強い敵が早く来る',
    start: 'ゲーム開始', back: 'メニューに戻る', guideTitle: '最初の一歩', guideIntro: '次の操作を試してください：',
    step1: 'キャラクターをタップして農民を選択。', step2: '下部の操作パネルで栽培・伐採・移動。', step3: '建築・訓練を行い拠点を守る。', step4: '任務を進め、敵の波に耐える。',
    tip: 'PCでは右クリックで移動指示。スマホでは画面の操作ボタンを使います。', optionsTitle: 'ゲーム設定', motion: 'アニメーションを減らす', motionHelp: 'メニューの動きとゲームエフェクトを軽減します。',
    optionsInfo: '現在セーブ・ロードは未実装です。進行はこのプレイ中のみ保持されます。', aboutTitle: 'あなただけの世界', aboutBody: '農業、探索、建築、防衛を楽しめる開発中の戦略ゲームです。',
    aboutFoot: '後からゲームエンジンを変更せずに画像を追加できます。', live: 'サーバーなしで開始できます',
  },
  ko: {
    tag: '새로운 세계가 기다립니다', titleTop: 'SHADOW', titleBottom: 'REALMS', subtitle: '성장 · 건설 · 방어',
    quick: '빠른 게임', custom: '사용자 설정', guide: '게임 방법', options: '게임 옵션', credits: '세계 소개', exit: '게임 목록으로',
    quickNote: '기본 전투 시작', customNote: '시작 난이도 설정', guideNote: '기본 조작 배우기', optionsNote: '화면 및 접근성', creditsNote: '세계 살펴보기', exitNote: 'Shadow로 돌아가기',
    corner: '로컬 전략 · 초기 버전', stamp: '운명을 선택하세요', setupTitle: '게임 준비', setupIntro: '시작 방식을 선택하세요.',
    explorer: '탐험가', explorerSub: '농부 4명 · 긴 준비 시간 · 약한 적', balanced: '수호자', balancedSub: '농부 3명 · 보통 적', warrior: '전사', warriorSub: '농부 2명 · 빠르고 강한 적',
    start: '게임 시작', back: '메뉴로 돌아가기', guideTitle: '첫 걸음', guideIntro: '다음 동작을 해보세요:',
    step1: '캐릭터를 클릭하여 농부를 선택합니다.', step2: '아래 명령창에서 농사, 벌목, 이동을 합니다.', step3: '건물을 짓고 병사를 훈련하여 기지를 지킵니다.', step4: '임무를 완수하고 적의 공격을 막으세요.',
    tip: 'PC에서는 오른쪽 클릭으로 이동하고, 모바일에서는 화면 조작 버튼을 사용합니다.', optionsTitle: '게임 옵션', motion: '애니메이션 줄이기', motionHelp: '메뉴 동작과 게임 효과를 줄입니다.',
    optionsInfo: '현재 저장과 불러오기는 지원하지 않습니다. 진행 상황은 이번 플레이 동안만 유지됩니다.', aboutTitle: '나만의 세계', aboutBody: '농사, 탐험, 건설과 방어를 즐기는 개발 중인 전략 게임입니다.',
    aboutFoot: '나중에 게임 엔진을 바꾸지 않고 새로운 그림을 넣을 수 있습니다.', live: '서버 없이 시작할 수 있습니다',
  },
});

const STYLE = `
.srm-root{--srm-gold:#f5d18b;--srm-ice:#60cfcc;--srm-parallax-x:0px;--srm-parallax-y:0px;position:fixed;inset:0;z-index:10000;isolation:isolate;overflow:hidden;background:#090e17;color:#fbf5e7;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;animation:srm-enter .6s ease-out both}
.srm-root *{box-sizing:border-box}.srm-root button,.srm-root a{font:inherit}.srm-root button{cursor:pointer}.srm-root button:focus-visible,.srm-root a:focus-visible,.srm-root input:focus-visible{outline:3px solid #78e3df;outline-offset:4px}.srm-root button:disabled{cursor:not-allowed;opacity:.55}
.srm-bg,.srm-haze,.srm-stars,.srm-mountains{position:absolute;inset:0;pointer-events:none}.srm-bg{background:radial-gradient(ellipse at 50% 28%,#25575e 0%,#10283c 33%,#121526 65%,#090b12 95%);transform:translate(var(--srm-parallax-x),var(--srm-parallax-y)) scale(1.045);transition:transform .25s ease-out}
.srm-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,transparent 18%,rgba(0,0,0,.55) 100%)}
.srm-haze{background:radial-gradient(ellipse at 20% 68%,#39a7a125,transparent 42%),radial-gradient(ellipse at 85% 61%,#ba6c393b,transparent 43%);animation:srm-haze 15s ease-in-out infinite alternate}
.srm-mountains{top:auto;height:38%;bottom:-5%;background:linear-gradient(0deg,#060913 12%,#111b29d9);clip-path:polygon(0 65%,9% 51%,17% 59%,28% 30%,38% 58%,47% 34%,58% 60%,69% 27%,81% 58%,89% 38%,100% 61%,100% 100%,0 100%);opacity:.88}
.srm-mountains::after{content:'';position:absolute;inset:0;background:#060910;clip-path:polygon(0 83%,12% 63%,25% 78%,37% 60%,52% 82%,67% 56%,80% 75%,100% 53%,100% 100%,0 100%)}
.srm-stars{overflow:hidden}.srm-star{position:absolute;left:var(--x);top:var(--y);width:var(--size);height:var(--size);border-radius:50%;background:var(--tone);box-shadow:0 0 11px var(--tone);opacity:.7;animation:srm-star var(--duration) ease-in-out infinite alternate;animation-delay:var(--delay)}
.srm-border{position:absolute;inset:13px;pointer-events:none;border:1px solid #e3b97e34;box-shadow:inset 0 0 30px #0005}.srm-border::before,.srm-border::after{content:'✦';position:absolute;color:var(--srm-gold);font-size:16px;opacity:.8}.srm-border::before{left:-5px;top:-11px}.srm-border::after{right:-5px;bottom:-11px}
.srm-shell{position:relative;z-index:1;display:flex;flex-direction:column;min-height:100%;min-height:100dvh;padding:26px clamp(22px,5vw,82px) 23px}
.srm-head,.srm-foot{display:flex;align-items:center;justify-content:space-between;gap:18px;z-index:2}.srm-brand{display:flex;align-items:center;gap:12px;font-weight:900;letter-spacing:.16em;font-size:12px;color:#f5ddaf}.srm-brand-mark{width:24px;height:24px;transform:rotate(45deg);border:2px solid #d9b675;box-shadow:0 0 0 4px #203e48,0 0 16px #3ab0ae75}.srm-head-tag,.srm-foot{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#d5d9d2aa}.srm-head-tag{border:1px solid #a1bead44;border-radius:999px;padding:8px 12px}
.srm-stage{flex:1;min-height:0;display:grid;grid-template-columns:minmax(220px,1fr) minmax(290px,1.18fr) minmax(220px,1fr);align-items:center;gap:clamp(10px,2vw,38px);max-width:1440px;width:100%;margin:auto}
.srm-side{display:flex;flex-direction:column;gap:17px;z-index:2}.srm-side--right{align-items:stretch}.srm-side--left{align-items:stretch}
.srm-choice{position:relative;isolation:isolate;width:100%;min-height:81px;text-align:left;display:flex;align-items:center;gap:14px;overflow:hidden;border:1px solid #e3ba7b7b;border-radius:15px;background:linear-gradient(103deg,#25343ce6,#12212cbd 66%,#263039c9);color:#fff7e8;padding:12px clamp(12px,1.8vw,22px);box-shadow:inset 0 1px #ffffff25,0 7px 18px #0006,0 0 0 3px #0b121b85;transition:transform .22s,border-color .22s,box-shadow .22s,background .22s}
.srm-choice::before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(105deg,transparent 24%,#a2e8df1f 48%,transparent 76%);transform:translateX(-120%);transition:transform .65s}.srm-choice:hover::before,.srm-choice:focus-visible::before{transform:translateX(110%)}.srm-choice:hover{transform:translateY(-3px);border-color:#83e6da;box-shadow:inset 0 1px #ffffff44,0 11px 28px #0009,0 0 22px #1acacb42}.srm-choice:active{transform:translateY(1px) scale(.985)}.srm-choice--primary{background:linear-gradient(110deg,#835b28e8,#493d31d9 50%,#244249e8);border-color:#ffe1a2;box-shadow:inset 0 1px #ffffff66,0 8px 22px #0009,0 0 23px #d6ae5229}.srm-choice-ico{flex:0 0 auto;display:grid;place-items:center;width:39px;height:39px;border:1px solid #f9ddab91;border-radius:12px;font-size:20px;color:var(--srm-gold);background:#0003}.srm-choice-label{display:block;font-weight:800;font-size:clamp(13px,1.2vw,17px)}.srm-choice-desc{display:block;font-size:10px;color:#b9c8c9;line-height:1.45;margin-top:4px}.srm-choice--primary .srm-choice-desc{color:#fff3d5}.srm-choice-arrow{margin-left:auto;color:#b8ddd0;font-weight:900}
.srm-emblem-wrap{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:510px;isolation:isolate;text-align:center}.srm-aura{position:absolute;width:min(35vw,450px);height:min(35vw,450px);min-width:295px;min-height:295px;border-radius:50%;background:radial-gradient(circle,#6bbab24b 0%,#223f5265 39%,transparent 72%);filter:blur(26px);animation:srm-breathe 6s ease-in-out infinite}
.srm-ring{position:absolute;width:clamp(275px,31vw,415px);height:clamp(275px,31vw,415px);border-radius:50%;border:2px solid #e6b86e80;box-shadow:inset 0 0 18px #50d1cf40,0 0 33px #30b0ad2a,0 0 0 10px #07151d91,0 0 0 12px #61d1c055;animation:srm-spin 58s linear infinite}
.srm-ring::before{content:'';position:absolute;inset:16px;border:3px dashed #c7d5c27c;border-radius:50%;box-shadow:0 0 10px #8de8e14a}.srm-ring::after{content:'◆ ✦ ◆ ✦ ◆ ✦ ◆ ✦';position:absolute;inset:0;border-radius:50%;display:grid;place-items:center;color:#eac57c;font-size:12px;letter-spacing:.85em;opacity:.72}
.srm-ring--second{width:clamp(240px,26vw,350px);height:clamp(240px,26vw,350px);border:4px double #6bd8cb80;box-shadow:inset 0 0 20px #0cd8bd38,0 0 15px #0008;animation-direction:reverse;animation-duration:42s}.srm-ring--second::after{content:''}
.srm-crest{position:relative;z-index:2;display:grid;place-items:center;width:clamp(225px,24vw,320px);height:clamp(225px,24vw,320px);border-radius:50%;background:radial-gradient(circle at 35% 25%,#294e58,#142a36 48%,#0a1723 73%);border:3px solid #f1ca80;box-shadow:0 0 0 8px #062934,0 0 0 10px #b5ddc155,inset 0 0 35px #020812,0 15px 60px #000a;animation:srm-float 5s ease-in-out infinite}
.srm-crest-shape{position:absolute;inset:20%;border:5px solid #c9ebc8;transform:rotate(45deg);border-radius:18%;box-shadow:0 0 0 9px #8eb3a31a,inset 0 0 25px #29c4be50}.srm-crest-shape::before{content:'✦';position:absolute;inset:0;display:grid;place-items:center;transform:rotate(-45deg);font-size:70px;color:#ffe4a1;text-shadow:0 3px #57392c,0 0 30px #f3d2858e}.srm-crest img{position:absolute;z-index:3;inset:8%;width:84%;height:84%;object-fit:contain;filter:drop-shadow(0 12px 20px #000a)}
.srm-title{position:relative;z-index:3;line-height:.83;letter-spacing:.03em;transform:translateY(-9px);filter:drop-shadow(0 12px 13px #000d)}.srm-title-line{display:block;font-size:clamp(27px,3.6vw,55px);font-weight:1000;color:#ffe5a7;-webkit-text-stroke:1px #6b4525;text-shadow:0 3px #785023,0 5px #132733,0 10px 2px #0008}.srm-title-line:nth-child(2){font-size:clamp(33px,4.2vw,64px);color:#ecf2e0;-webkit-text-stroke:1px #18585d;text-shadow:0 3px #357779,0 6px #101d2a,0 11px 2px #0009}.srm-subtitle{margin:10px 0 0;font-size:12px;font-weight:800;letter-spacing:.18em;color:#e6d3aa;text-shadow:0 2px 5px #000}.srm-strap{position:absolute;bottom:-12px;z-index:1;color:#e3c58c;letter-spacing:.2em;font-size:10px;opacity:.9}.srm-strap::before,.srm-strap::after{content:'✧';padding:0 10px}
.srm-foot{margin-top:14px;padding-top:14px;border-top:1px solid #f0c98f2c}.srm-live{color:#98ded2;font-weight:700;letter-spacing:.05em;text-transform:none}
.srm-panel-scrim{position:absolute;inset:0;z-index:6;background:#020810aa;display:grid;place-items:center;padding:18px;backdrop-filter:blur(7px);animation:srm-enter .25s ease-out}.srm-panel{width:min(600px,100%);max-height:min(82vh,740px);overflow:auto;border:1px solid #dfc28f90;border-radius:22px;background:linear-gradient(145deg,#243641,#111d2a 62%,#202f38);padding:clamp(20px,3vw,34px);box-shadow:0 20px 70px #000c,inset 0 1px #fff4}.srm-panel h2{margin:0 0 8px;font-size:clamp(22px,3vw,32px);color:#ffdf9f}.srm-panel p{color:#d5dfde;line-height:1.7;font-size:14px}.srm-panel-header{display:flex;align-items:start;justify-content:space-between;gap:10px}.srm-panel-close{border:1px solid #beaf8999;background:#18232d;color:#ffe0a4;border-radius:9px;width:36px;height:36px;font-size:18px}.srm-preset-list{display:grid;gap:9px;margin:22px 0}.srm-preset{width:100%;border:1px solid #6c8990;border-radius:12px;background:#0e1b27c9;color:#fff0d0;padding:14px 16px;text-align:left;display:flex;align-items:center;gap:12px}.srm-preset[aria-pressed=true]{border-color:#ffe09c;box-shadow:0 0 0 2px #e5c37a38,inset 0 0 20px #b9a65d21;background:#3b413f}.srm-preset::before{content:'◇';font-size:26px;color:#b4d9d5}.srm-preset[aria-pressed=true]::before{content:'◆';color:#ffdb83}.srm-preset strong{display:block;font-size:15px}.srm-preset small{display:block;font-size:12px;color:#acc5c8;margin-top:4px;line-height:1.55}.srm-panel-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.srm-action{border:1px solid #c3b88d;border-radius:11px;padding:12px 20px;color:#f7e8c5;background:#263d45;font-weight:800;min-height:45px}.srm-action--gold{background:linear-gradient(110deg,#b28540,#805927);border-color:#ffe1a0;color:#fffaf0;flex:1}.srm-action:hover{filter:brightness(1.15)}.srm-guide-list{padding-left:22px;color:#d7eae1;line-height:1.8;font-size:14px}.srm-guide-list li{margin:9px 0}.srm-tip{border-left:3px solid #b6d8bf;background:#83bbb51a;padding:14px;border-radius:8px;color:#c4eddd;font-size:13px;line-height:1.7}.srm-switch-row{margin:20px 0;display:flex;align-items:center;justify-content:space-between;gap:15px;padding:14px;border:1px solid #67818888;border-radius:12px}.srm-switch-row strong{display:block;color:#f6e4ba;font-size:14px}.srm-switch-row small{display:block;color:#adc5cc;font-size:12px;line-height:1.55;margin-top:5px}.srm-switch-row input{width:24px;height:24px;accent-color:#d0ac68;flex:0 0 auto}.srm-about-icon{font-size:40px;color:#eec477;padding-top:8px}
.srm-root.is-closing{animation:srm-leave .32s ease-in both;pointer-events:none}.srm-root.reduced-motion *,.srm-root.reduced-motion *::before,.srm-root.reduced-motion *::after{animation:none!important;transition:none!important}
@keyframes srm-enter{from{opacity:0}to{opacity:1}}@keyframes srm-leave{to{opacity:0}}@keyframes srm-spin{to{transform:rotate(360deg)}}@keyframes srm-breathe{50%{transform:scale(1.12);opacity:.7}}@keyframes srm-float{50%{transform:translateY(-11px)}}@keyframes srm-haze{to{transform:translateX(4%) scale(1.08)}}@keyframes srm-star{to{opacity:.12;transform:translateY(-12px)}}
@media(max-width:1030px){.srm-shell{padding:20px 26px}.srm-stage{grid-template-columns:minmax(185px,1fr) minmax(235px,1fr) minmax(185px,1fr);gap:12px}.srm-choice{min-height:76px;padding:10px}.srm-choice-desc{font-size:9px}.srm-crest{width:235px;height:235px}.srm-emblem-wrap{min-height:425px}.srm-ring{width:290px;height:290px}.srm-ring--second{width:245px;height:245px}}
@media(max-width:740px){.srm-root{overflow:auto}.srm-shell{min-height:100dvh;padding:21px 19px 18px}.srm-head-tag{font-size:9px;letter-spacing:.06em}.srm-stage{grid-template-columns:1fr 1fr;align-content:start;gap:11px;margin:9px auto 5px;align-items:start}.srm-emblem-wrap{grid-column:1/-1;grid-row:1;min-height:270px;margin:4px auto 5px}.srm-crest{width:155px;height:155px;border-width:2px}.srm-crest-shape{border-width:3px}.srm-crest-shape::before{font-size:38px}.srm-ring{width:193px;height:193px}.srm-ring--second{width:166px;height:166px}.srm-aura{min-width:200px;min-height:200px}.srm-title-line{font-size:29px}.srm-title-line:nth-child(2){font-size:35px}.srm-title{transform:translateY(-2px)}.srm-subtitle{font-size:10px}.srm-strap{display:none}.srm-side{gap:11px}.srm-choice{min-height:74px;gap:8px;flex-wrap:wrap;border-radius:11px;padding:9px}.srm-choice-ico{height:29px;width:29px;font-size:16px;border-radius:7px}.srm-choice-label{font-size:12px}.srm-choice-arrow{display:none}.srm-choice-desc{flex-basis:100%;font-size:10px}.srm-head{min-height:36px}.srm-brand{font-size:10px;letter-spacing:.06em}.srm-foot{font-size:9px;letter-spacing:.04em}.srm-border{inset:6px}.srm-mountains{height:43%}}
@media(max-width:390px){.srm-choice-ico{display:none}.srm-choice{min-height:67px}.srm-head-tag{display:none}.srm-emblem-wrap{min-height:240px}}
@media(max-height:650px) and (min-width:741px){.srm-shell{padding-top:16px;padding-bottom:12px}.srm-stage{transform:scale(.88);transform-origin:center}.srm-emblem-wrap{min-height:420px}.srm-choice{min-height:63px}.srm-side{gap:10px}}
@media(prefers-reduced-motion:reduce){.srm-root *,.srm-root *::before,.srm-root *::after{animation:none!important;transition:none!important}}
`;

function node(tag, className, text = null) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (text !== null) result.textContent = text;
  return result;
}

function button(label, className, click) {
  const el = node('button', className);
  el.type = 'button';
  el.textContent = label;
  if (typeof click === 'function') el.addEventListener('click', click);
  return el;
}

function createChoice(symbol, label, description, click, primary = false) {
  const el = node('button', `srm-choice${primary ? ' srm-choice--primary' : ''}`);
  el.type = 'button';
  el.append(node('span', 'srm-choice-ico', symbol));
  const content = node('span', 'srm-choice-content');
  content.append(node('span', 'srm-choice-label', label));
  content.append(node('span', 'srm-choice-desc', description));
  el.append(content, node('span', 'srm-choice-arrow', '›'));
  el.addEventListener('click', click);
  return el;
}

export function showShadowRealmsMenu({ mount = document.body } = {}) {
  if (!(mount instanceof Element)) throw new TypeError('The menu requires a valid mount element');
  if (document.getElementById('sr-main-menu')) throw new Error('Shadow Realms main menu is already open');

  const lang = String(document.documentElement.lang || navigator.language || 'en').toLowerCase().split('-')[0];
  const t = TEXT[lang] || TEXT.en;
  let reducedMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  let selectedPreset = 'balanced';
  const previousFocus = document.activeElement;
  const previousOverflow = document.body.style.overflow;
  let finished = false;
  let panel = null;
  let pendingAnimation = 0;
  let mouseX = 0;
  let mouseY = 0;

  const style = node('style');
  style.textContent = STYLE;
  const root = node('div', 'srm-root');
  root.id = 'sr-main-menu';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Shadow Realms');
  if (reducedMotion) root.classList.add('reduced-motion');
  const bg = node('div', 'srm-bg');
  if (ART.background) bg.style.backgroundImage = `url("${ART.background}")`;
  const haze = node('div', 'srm-haze');
  const mountains = node('div', 'srm-mountains');
  const stars = node('div', 'srm-stars');
  for (let i = 0; i < 30; i++) {
    const star = node('span', 'srm-star');
    const x = (i * 47.39 + 11) % 100;
    const y = (i * 31.73 + 7) % 79;
    star.style.setProperty('--x', `${x}%`);
    star.style.setProperty('--y', `${y}%`);
    star.style.setProperty('--size', `${i % 4 === 0 ? 3 : 2}px`);
    star.style.setProperty('--tone', i % 3 ? '#85e8d2' : '#f9ce86');
    star.style.setProperty('--duration', `${3 + (i % 6)}s`);
    star.style.setProperty('--delay', `${-(i % 5)}s`);
    stars.append(star);
  }
  root.append(bg, haze, mountains, stars, node('div', 'srm-border'));
  const shell = node('div', 'srm-shell');
  const head = node('header', 'srm-head');
  const brand = node('div', 'srm-brand');
  brand.append(node('span', 'srm-brand-mark'), node('span', '', 'SHADOW / REALMS'));
  head.append(brand, node('span', 'srm-head-tag', t.corner));
  shell.append(head);
  const stage = node('main', 'srm-stage');
  const left = node('nav', 'srm-side srm-side--left');
  left.setAttribute('aria-label', t.quick);
  const right = node('nav', 'srm-side srm-side--right');
  right.setAttribute('aria-label', t.options);
  const emblem = node('div', 'srm-emblem-wrap');
  const aura = node('div', 'srm-aura');
  const ringA = node('div', 'srm-ring');
  const ringB = node('div', 'srm-ring srm-ring--second');
  const crest = node('div', 'srm-crest');
  crest.append(node('div', 'srm-crest-shape'));
  if (ART.crest) {
    const img = node('img');
    img.src = ART.crest;
    img.alt = 'Shadow Realms';
    crest.append(img);
  }
  const title = node('div', 'srm-title');
  title.append(node('span', 'srm-title-line', t.titleTop), node('span', 'srm-title-line', t.titleBottom));
  const subtitle = node('p', 'srm-subtitle', t.subtitle);
  emblem.append(aura, ringA, ringB, crest, title, subtitle, node('span', 'srm-strap', t.stamp));
  stage.append(left, emblem, right);
  shell.append(stage);
  const foot = node('footer', 'srm-foot');
  foot.append(node('span', '', 'SHADOW REALMS  ·  PREVIEW BUILD'), node('span', 'srm-live', t.live));
  shell.append(foot);
  root.append(shell);

  function removePanel() {
    if (!panel) return;
    panel.remove();
    panel = null;
    root.querySelector('.srm-choice')?.focus({ preventScroll: true });
  }

  function openPanel(name) {
    if (finished) return;
    removePanel();
    const scrim = node('div', 'srm-panel-scrim');
    const body = node('section', 'srm-panel');
    body.setAttribute('role', 'document');
    const header = node('div', 'srm-panel-header');
    const titles = { setup: t.setupTitle, guide: t.guideTitle, options: t.optionsTitle, credits: t.aboutTitle };
    header.append(node('h2', '', titles[name]));
    header.append(button('×', 'srm-panel-close', removePanel));
    body.append(header);

    if (name === 'setup') {
      body.append(node('p', '', t.setupIntro));
      const choices = node('div', 'srm-preset-list');
      for (const id of ['explorer', 'balanced', 'warrior']) {
        const option = node('button', 'srm-preset');
        option.type = 'button';
        option.setAttribute('aria-pressed', String(selectedPreset === id));
        const item = node('span');
        item.append(node('strong', '', t[id]), node('small', '', t[`${id}Sub`]));
        option.append(item);
        option.addEventListener('click', () => {
          selectedPreset = id;
          for (const other of choices.children) other.setAttribute('aria-pressed', String(other === option));
        });
        choices.append(option);
      }
      body.append(choices);
      const actions = node('div', 'srm-panel-actions');
      actions.append(button(t.back, 'srm-action', removePanel));
      actions.append(button(t.start, 'srm-action srm-action--gold', () => finish(selectedPreset)));
      body.append(actions);
    } else if (name === 'guide') {
      body.append(node('p', '', t.guideIntro));
      const list = node('ol', 'srm-guide-list');
      for (const line of [t.step1, t.step2, t.step3, t.step4]) list.append(node('li', '', line));
      body.append(list, node('div', 'srm-tip', t.tip));
      const actions = node('div', 'srm-panel-actions');
      actions.append(button(t.back, 'srm-action srm-action--gold', removePanel));
      body.append(actions);
    } else if (name === 'options') {
      const row = node('label', 'srm-switch-row');
      const text = node('span');
      text.append(node('strong', '', t.motion), node('small', '', t.motionHelp));
      const check = node('input');
      check.type = 'checkbox';
      check.checked = reducedMotion;
      check.addEventListener('change', () => {
        reducedMotion = check.checked;
        root.classList.toggle('reduced-motion', reducedMotion);
      });
      row.append(text, check);
      body.append(row, node('p', '', t.optionsInfo));
      const actions = node('div', 'srm-panel-actions');
      actions.append(button(t.back, 'srm-action srm-action--gold', removePanel));
      body.append(actions);
    } else {
      body.append(node('div', 'srm-about-icon', '✧'));
      body.append(node('p', '', t.aboutBody), node('div', 'srm-tip', t.aboutFoot));
      const actions = node('div', 'srm-panel-actions');
      actions.append(button(t.back, 'srm-action srm-action--gold', removePanel));
      body.append(actions);
    }

    scrim.append(body);
    scrim.addEventListener('pointerdown', event => {
      if (event.target === scrim) removePanel();
    });
    root.append(scrim);
    panel = scrim;
    body.querySelector('button')?.focus({ preventScroll: true });
  }

  let resolveStart;
  const ready = new Promise(resolve => { resolveStart = resolve; });
  function cleanup() {
    if (pendingAnimation) cancelAnimationFrame(pendingAnimation);
    root.removeEventListener('pointermove', onMove);
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = previousOverflow;
    root.remove();
    style.remove();
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }
  function finish(id, mode = 'custom') {
    if (finished) return;
    finished = true;
    const preset = PRESETS[id] || PRESETS.balanced;
    root.classList.add('is-closing');
    const outcome = { ...preset, reducedMotion, mode };
    if (reducedMotion) {
      cleanup();
      resolveStart(outcome);
    } else {
      window.setTimeout(() => { cleanup(); resolveStart(outcome); }, 320);
    }
  }
  function onMove(event) {
    if (reducedMotion || finished || pendingAnimation) return;
    mouseX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 16;
    mouseY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 12;
    pendingAnimation = requestAnimationFrame(() => {
      root.style.setProperty('--srm-parallax-x', `${mouseX.toFixed(2)}px`);
      root.style.setProperty('--srm-parallax-y', `${mouseY.toFixed(2)}px`);
      pendingAnimation = 0;
    });
  }
  function onKey(event) {
    if (event.key === 'Escape' && panel) { event.preventDefault(); removePanel(); }
    if (event.key !== 'Tab') return;
    const scope = panel?.querySelector('.srm-panel') || root;
    const focusables = [...scope.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
    if (!focusables.length) return;
    if (event.shiftKey && document.activeElement === focusables[0]) {
      event.preventDefault(); focusables[focusables.length - 1].focus();
    } else if (!event.shiftKey && document.activeElement === focusables[focusables.length - 1]) {
      event.preventDefault(); focusables[0].focus();
    }
  }

  left.append(
    createChoice('⚔', t.quick, t.quickNote, () => finish('balanced', 'quick'), true),
    createChoice('✦', t.custom, t.customNote, () => openPanel('setup')),
    createChoice('▣', t.guide, t.guideNote, () => openPanel('guide')),
  );
  right.append(
    createChoice('⚙', t.options, t.optionsNote, () => openPanel('options')),
    createChoice('◇', t.credits, t.creditsNote, () => openPanel('credits')),
    createChoice('↩', t.exit, t.exitNote, () => window.location.assign('/game')),
  );

  mount.append(style, root);
  document.body.style.overflow = 'hidden';
  root.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('keydown', onKey);
  left.querySelector('button')?.focus({ preventScroll: true });
  return ready;
}

export default showShadowRealmsMenu;
