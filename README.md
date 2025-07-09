## 따라하기 URL 
https://github.com/matteogp/openSAP7-xsa-node-2

# 무조간 만들어야 할 듯
srv/utils/util.js : 다른 서비스와 파일에 재사용 가능한 기능을 보관할 중앙 node.js 파일

srv/utils/dbPromises.js : Node.js 서버가 데이터베이스에 연결하고 상호 작용할 수 있도록 함. SAP HANA 데이터베이스에 연결하는 데 필요한 기능을 포함하는 Node.js 파일

srv/server.js : node 서버 기동 관련 로직( port, jwt, ... )

#

srv/package.json 
  postinstall 에서 서버에 cds 명령어가 없어 빌드 못함. 해당 라인 원복했음.

#
어찌어찌 해서 빌드는 되ㅈ만 실행할 떄 에러남. 
더 많은 학습 후 재시도 해 볼 예정.