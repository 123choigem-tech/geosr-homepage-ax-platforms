/* Hierarchy: user-supplied organization chart. Roles: brochure-based editorial
   proposals, not an independently verified allocation of departmental duties.
   English department names are working translations. See SOURCES.md. */
window.companyContent={
 support:[
  {ko:'Think Tank 본부',en:'Think Tank',roleKo:'기술·연구 자문',roleEn:'Technical and research advisory'},
  {ko:'전략기획실',en:'Strategic Planning',roleKo:'사업 전략·과제 기획',roleEn:'Business strategy and project planning'},
  {ko:'경영총괄부',en:'Corporate Management',roleKo:'경영 운영·조직 지원',roleEn:'Corporate operations and team support'}
 ],
 divisions:[
  {id:'prediction',ko:'AI & 예측부문',en:'AI & Prediction',units:['research','forecast']},
  {id:'environment',ko:'환경 & 공간융합 부문',en:'Environment & Spatial Integration',units:['ecology','integration']},
  {id:'systems',ko:'Data & System 부문',en:'Data & Systems',units:['survey','coastal','spatial','systems']}
 ],
 departments:[
  {id:'research',ko:'부설연구소',en:'Research Institute',roleKo:'수치모델·AI 연구와 예측기술 개발',roleEn:'Numerical modelling & AI prediction',tasksKo:['유동·파랑·퇴적·수질 수치모델링','AI 기반 영상분석 및 환경 예측','모델 검증과 시뮬레이션 기술 연구'],tasksEn:['Hydrodynamic, wave, sediment and water-quality models','AI image analysis and environmental prediction','Model validation and simulation research'],pages:'14–15, 30–31, 36–39'},
  {id:'forecast',ko:'예보사업부',en:'Forecasting',roleKo:'해양·기상 예측자료 생산과 예보시스템 운영',roleEn:'Ocean forecasts & operational systems',tasksKo:['해수유동·수온·염분·파랑 예측','관측자료 동화와 예측 정확도 평가','실시간 예측시스템 구축·유지관리'],tasksEn:['Current, temperature, salinity and wave forecasts','Observation assimilation and forecast evaluation','Operational forecast systems and maintenance'],pages:'30–31'},
  {id:'ecology',ko:'환경화학생태부',en:'Environmental Chemistry & Ecology',roleKo:'수질·퇴적물 분석과 생태계 조사·평가',roleEn:'Water, sediment & ecosystem assessment',tasksKo:['수질·퇴적물 시료 분석과 정도관리','해양환경영향평가와 생태계 모니터링','갯벌 보전·복원 및 블루카본 평가'],tasksEn:['Water and sediment analysis and quality assurance','Environmental impact assessment and ecosystem monitoring','Tidal-flat restoration and blue-carbon assessment'],pages:'16–19, 46–47'},
  {id:'integration',ko:'공간융합부',en:'Spatial Integration',roleKo:'공간자료 융합과 연안재해 위험평가',roleEn:'Spatial data & coastal-hazard assessment',tasksKo:['연안 공간정보 구축 및 GIS 분석','연안재해 취약성·기후변화 영향 평가','폭풍해일·복합침수 시나리오 분석'],tasksEn:['Coastal spatial databases and GIS analysis','Coastal vulnerability and climate-impact assessment','Storm-surge and compound-flood scenarios'],pages:'26–29'},
  {id:'survey',ko:'환경조사부',en:'Environmental Survey',roleKo:'해양물리·수리·퇴적환경 현장조사',roleEn:'Ocean-physics & sediment surveys',tasksKo:['조석·해류·파랑 등 해양물리 관측','수리·퇴적환경 현장자료 수집·분석','관측자료 품질관리와 조사 결과 정리'],tasksEn:['Tide, current and wave observations','Hydrodynamic and sediment field-data analysis','Observation quality checks and survey reporting'],pages:'4–5, 34–35'},
  {id:'coastal',ko:'연안관리부',en:'Coastal Management',roleKo:'연안침식 모니터링과 해안선 변화 분석',roleEn:'Coastal erosion & shoreline monitoring',tasksKo:['연안침식 실태조사와 원인 분석','비디오·항공영상 기반 해안선 모니터링','침식방지대책 검토와 효과 평가'],tasksEn:['Coastal-erosion surveys and cause analysis','Video and aerial shoreline monitoring','Erosion-mitigation planning and evaluation'],pages:'24–25'},
  {id:'spatial',ko:'공간정보부',en:'Geospatial Information',roleKo:'해저지형·지층탐사와 UAV·LiDAR 측량',roleEn:'Seabed mapping, UAV and LiDAR',tasksKo:['멀티빔 수심측량과 해저면 영상조사','고해상 지층·이상체 탐사','무인항공측량·LiDAR 및 공간자료 처리'],tasksEn:['Multibeam bathymetry and seabed imaging','High-resolution sub-bottom and object surveys','UAV, LiDAR and spatial-data processing'],pages:'40–41'},
  {id:'systems',ko:'시스템개발부',en:'Systems Development',roleKo:'관측장비·원격 모니터링 시스템 개발 및 운영',roleEn:'Observation & remote-monitoring systems',tasksKo:['해양관측장비·부이 설계 및 개발','실시간 송수신·원격 모니터링 시스템','관측시스템 구축·운영·유지관리'],tasksEn:['Observation instruments and buoy development','Live data transmission and remote monitoring','System installation, operation and maintenance'],pages:'34–35, 38–39'}
 ]
};
