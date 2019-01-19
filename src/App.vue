<template>
  <div id="app">
    <el-container class="container">
      <el-header class="header">
        <div class="title">LixMonitor</div>
      </el-header>

      <el-main class="main">
        <el-row>
          <el-col :span="16" :offset="4">
            <ve-line :data="chartData_cpu" :settings="chartSettings"></ve-line>
            <ve-line :data="chartData_mem" :settings="chartSettings"></ve-line>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
  

<style >
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
  padding: 0px;
}

.container .header {
  background: rgb(84, 92, 100);
  line-height: 60px;
  height: 60px;
  padding: 0px;
}
.container .header .title {
  float: left;
  color: #ffffff;
  font-size: 22px;
  height: 60px;
  width: 230px;
  border-right-width: 2px;
  border-right-style: solid;
  border-color: #e6fffd;
}
.container .header .menu {
  float: left;
  height: 60px;
  width: auto;
  margin-left: 20px;
}
.container .header .search {
  float: right;
  color: #ffffff;
  font-size: 22px;
  height: 60px;
  padding-right: 20px;
}
.container .header .userinfo {
  float: right;
  color: #ffffff;
  font-size: 18px;
  height: 60px;
  padding-right: 20px;
}
.container .header .userinfo .avatar {
  float: right;
  color: #fff;
  height: 40px;
  width: 40px;
  border-radius: 23px;
  margin: 10px 0 10px 10px;
}

.el-main {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  align-self: center;
  width: 1140px;
}

.container .main {
  padding: 0 0 0 0;
  margin-top: 30px;
}
.container .main .nav {
  width: 100%;
  background: #2c3e50;
}
.container .main .list {
  overflow: hidden;
  color: #2c3e50;
}
.container .main .list .listitem {
  padding-bottom: 10px;
  border-bottom: 1px;
  border-bottom: #2c3e50;
  border-bottom-style: solid;
}
.container .main .list ul {
  margin: 0px;
  padding: 0px;
}
.container .main .list .name {
  font-size: 22px;
  float: left;
  width: auto;
}
.container .main .list .img {
  height: 120px;
  padding-top: 20px;
}
.container .main .list .description {
  color: #2c3e50;
  width: 100%;
}
.container .main .list .description .txt {
  float: left;
  color: #2c3e50;
}
.container .main .list .description .button {
  float: right;
}

.table {
  border: 2px solid #ddd;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.border {
  border-style: solid;
  border-width: 2px;
  border-color: #ddd;
}

.content {
  border-width: 0;
  border-style: solid;
  border-bottom: 1px;
  border-bottom-color: #ddd;
}
</style>
<script >
export default {
  data() {
    this.chartSettings = {
      stack: { 用户: ["访问用户", "下单用户"] },
      area: true,
      min: [0, 0],
      max: [100, 100]
    };
    return {
      retryCount: 0,
      chartData_cpu: {
        columns: ["时间", "CPU占用率"],
        rows: []
      },
      chartData_mem: {
        columns: ["时间", "内存占用率"],
        rows: []
      },
      proc: []
    };
  },
  created() {
    this.initWS();
  },
  destroyed: function() {
    this.closeWS();
  },
  methods: {
    initWS() {
      if (this.ws == null || this.ws.readyState != WebSocket.OPEN) {
        this.ws = new WebSocket("ws://118.25.27.241:9981");
      }
      this.ws_state = this.ws.readyState;
      this.ws.onopen = this.ws_onopen;
      this.ws.onerror = this.ws_onerror;
      this.ws.onmessage = this.ws_onmessage;
      this.ws.onclose = this.ws_onclose;
    },
    closeWS() {
      this.ws_onclose();
    },
    ws_onopen() {
      //this.notification("连接已建立", "成功", "success");
      this.ws_state = this.ws.readyState;
      this.retryCount = 0;
    },
    ws_onerror() {
      this.notification("连接发生错误", "错误", "error");
    },
    ws_onmessage(e) {
      //  this.notification(e.data, "收到消息");
      var result = JSON.parse(e.data);
      var myDate = new Date();
      this.proc = result["ProcInfo"];
      var cpu = 0;
      var mem = 0;
      for (var i = 0; i < this.proc.length; i++) {
        cpu += parseFloat(this.proc[i][2]);
        mem += parseFloat(this.proc[i][3]);
      }
      if (cpu > 100) cpu = 100;
      var tmp1 = {},
        tmp2 = {};
      tmp1["时间"] = myDate.toLocaleTimeString();
      tmp2["时间"] = myDate.toLocaleTimeString();
      tmp1["CPU占用率"] = cpu;
      tmp2["内存占用率"] = mem;
      this.chartData_cpu.rows.push(tmp1);
      this.chartData_mem.rows.push(tmp2);
    },
    ws_onclose() {
      //this.notification("连接关闭", "错误", "error");
      this.ws_state = this.ws.readyState;
      if (this.retryCount < 3) {
        this.retryCount++;
        this.initWS();
      }
      this.user_id = 0;
      this.my_notice_list = [];
      this.my_application_list = [];
    },
    send_msg(request) {
      if (this.ws.readyState == WebSocket.CLOSED) {
        this.initWS();
      }
      //  this.ws.send(JSON.stringify(request, null, 0));
      // this.notification(JSON.stringify(request, null, 0), "发送消息");
    }
  },
  computed: {}
};
</script>