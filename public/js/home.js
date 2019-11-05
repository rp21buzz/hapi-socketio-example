var app = new Vue({
  el: '#home',
  data: {
    socket: null,
    lastUpdated: '',
    username: '',
    users: {},
    activeNotifyDiv: 'new',
    notifications: [],
    staleNotifications: [],
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
    addToast: function(toastContainer, toastType, msg ) {
      let d = new Date();
      this[toastContainer].push({
        container: toastContainer,
        cfg: this.toastConfig[toastType],
        msg: msg,
        dt: d.toISOString()
      });
    },
    delToast: function(toastContainer, index) {
      this[toastContainer].splice(index,1);
    },
    clearNotifications: function() {
      while (this.notifications.length != 0) {
        let note = this.notifications.shift();
        this.staleNotifications.push(note);
      }
      // this.activeNotifyDiv = 'new';
    },
    setupSockets: function(){
      this.socket = io(window.location.origin, {
        path: '/socketio',
        transports: ['websocket', 'polling'],
        reconnectionDelay: 1000
      });
      console.log(this.socket);
      //
      this.socket.on('connect', () => {
        app.addToast('pgNotifications','success', "Socket connection handshake successful");
        this.socket.emit('subscribe',this.username);
      });
      //
      this.socket.on('disconnect', (reason) => {
        if(reason === "stale-connection"){
          this.socket.connect();
        }else{
          this.addToast('pgNotifications','error', "Socket disconnected");
        }
      });
      //
      this.socket.on('pushNotify-all', (data) => {
        this.addToast('notifications','info', data.msg);
      });
      //
      this.socket.on('pushNotify-user', (data) => {
        console.log('notifications','primary', data.msg);
        this.addToast('notifications','primary', data.msg);
      });
      //
      this.socket.on('users', (users) => {
        if(users){
          console.log(users);
          this.users = users;
        }
      });
    },
    userSignup: function() {
      let form_data = $('#form-signup').serialize();
      $.post("/signup", form_data)
      .done( (resp) => {
        if(resp.success){
          this.username = resp.username;
          this.socket.emit('subscribe',this.username);
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
        let form_data = JSON.stringify( $('#form-broadcastNotify').serializeArray() );
        console.log(form_data);
        form_data['sender'] = this.username;
        this.socket.emit('pushNotify-all', form_data);
      }
    },
    pushNotify: function() {
      let form_data = JSON.stringify( $('#form-pushNotify').serializeArray() );
      console.log(form_data);
      form_data['sender'] = this.username;
      this.socket.emit('pushNotify-user', form_data);
    },
  }
});
