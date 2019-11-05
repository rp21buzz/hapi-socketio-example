var app = new Vue({
  el: '#home',
  data: {
    socket: null,
    lastUpdated: '',
    username: '',
    activeNotifyDiv: 'new',
    newNotifications: [],
    staleNotifications: [],
    displayNotifications: [],
    pgNotifications:[],
    toastConfig: {
      error: {
        cls: 'error alert-danger',
        icon: 'fas fa-grimace',
        title: 'Error'
      },
      success: {
        cls: 'success alert-success',
        icon: 'fas fa-grin-beam',
        title: 'Success'
      },
      info: {
        cls: 'info alert-info',
        icon: 'fas fa-grin-alt',
        title: 'Info'
      },
      primary: {
        cls: 'primary alert-primary',
        icon: 'fas fa-grin-alt',
        title: 'Info'
      }
    }
  },
  created: function () {
    $('#rootContainer').toggleClass('d-none');
    let d = new Date();
    this.lastUpdated = d.toISOString();
    this.setupSockets();
  },
  computed: {
    getLastUpdated: function(){
      return this.lastUpdated
    },
    isUserLoggedIn: function () {
      return this.username !='' ? true : false;
    }
  },
  methods: {
    addToast: function(toastContainer, toastType, errMsg ) {
      let d = new Date();
      this.pgNotifications.push({
        container: toastContainer,
        cfg: this.toastConfig[toastType],
        msg: errMsg,
        dt: d.toISOString()
      });
    },
    delToast: function(toastContainer, index) {
      this[toastContainer].splice(index,1);
    },
    refreshNotificationsDisplay: function() {
      while (this.displayNotifications) {
        let note = this.displayNotifications.shift();
        this.staleNotifications.push(note);
      }
      while (this.newNotifications) {
        let note = this.newNotifications.shift();
        this.displayNotifications.push(note);
      }
      // this.activeNotifyDiv = 'new';
    },
    setupSockets: function(){
      this.socket = io(window.location.origin, {
        path: '/socketio',
        transports: ['websocket', 'polling'],
        reconnectionDelay: 1000
      });
      //
      this.socket.on('broadcast', function(msg){
        let d = new Date();
        this.newNotifications.push({
          container: 'newNotifications',
          title: 'Broadcast Notification',
          cfg: this.toastConfig['info'],
          msg: msg,
          dt: d.toISOString()
        });
      });
      //
      this.socket.on('push', function(msg){
        let d = new Date();
        this.newNotifications.push({
          container: 'newNotifications',
          title: 'Targeted Notification',
          cfg: this.toastConfig['primary'],
          msg: msg,
          dt: d.toISOString()
        });
      });
    },
    userSignup: function() {
      let form_data = $('#form-signup').serialize();
      $.post("/signup", form_data)
      .done( (resp) => {
        if(resp.success){
          this.username = resp.username;
          app.addToast('pgNotifications','success', resp.msg);
        }else{
          app.addToast('pgNotifications','error', resp.msg);
        }
      })
      .fail( (resp) => {
        app.addToast('pgNotifications','error', 'Error connecting to server');
      });
    },
    broadcastNotify: function() {
      if(this.socket){
        let form_data = $('#broadcastNotify').serializeObject();
        form_data['sender'] = this.username;
        this.socket.emit('broadcast', form_data);
      }
    },
    pushNotify: function() {
      let form_data = $('#broadcastNotify').serializeObject();
    },
  }
});
