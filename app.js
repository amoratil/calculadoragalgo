
Vue.component ('visualizaciontiempo',{
    template:'<div>timegoesbysoslowly</div>',
    data: function() {
        return {
            dato:0
        }
    }
});

Vue.component('visualizacioncalculadora', {
    template: '<div><div>Puntos: {{puntos}}. Quedan {{queda}} segundos.</div>' +
    '<h3><span class="primero">{{operador1}}</span><span class="operacion">{{operacion}}</span><span class="segundo">{{operador2}}</span>' +
    '&nbsp; &nbsp; <input ref="resp" v-model="respuesta"></div></h3>',
    data: function(){
        return {
            contador:0,
            operador1:4,
            operacion:'+',
            operador2:5,
            respuesta:'',
            puntos:0,
            resultado:9,
            racha:0,
            queda:0
        }
    },
    watch: {
        // whenever question changes, this function will run
        respuesta: function (antes, ahora) {
            if (Number(antes)===this.resultado){
                this.sonidoOk();
                this.racha++;
                this.puntos=Math.ceil(this.puntos + this.racha * this.resultado/5);
                //ahora avanzaríamos en el contador y a ver qué nos toca.
                this.avanzaPregunta();
            }


        }
    },
    created: function () {

        this.timer = setInterval(this.updateTiempo,200);
        this.avanzaPregunta();
        this.audiocontext = new AudioContext();


    },
    methods: {

        updateTiempo: function(){
            this.$nextTick(function() {this.$refs.resp.focus()})
            this.queda=Math.floor((this.fin-Date.now())/1000);
            if (this.queda < 0) {
                this.racha=0;
                this.sonidoFallo();
                this.avanzaPregunta();
            }
        },
        avanzaPregunta: function(){
            var maxTiempoSegundos=20;
            switch (Math.floor(Math.random()*3)){
                case 0: //+
                    this.operador1 = Number(Math.floor(Math.random()*10*(this.puntos>1000?10:1)));
                    this.operador2 = Number(Math.floor(Math.random()*10*(this.puntos>1000?10:1)));
                    this.resultado=this.operador1+this.operador2;
                    this.operacion='+';
                    maxTiempoSegundos = (this.resultado>20)?20:this.resultado;
                    break;
                case 1: //-
                    this.operador1 = Number(Math.floor(Math.random()*10*(this.puntos>1000?10:1)));
                    this.operador2 = Number(Math.floor(Math.random()*10*(this.puntos>1000?10:1)));
                    if (this.operador2>this.operador1){
                        var temp = this.operador2;
                        this.operador2 = this.operador1;
                        this.operador1=temp;
                    }
                    this.resultado = this.operador1-this.operador2;
                    this.operacion='-';
                    maxTiempoSegundos = (this.operador1+this.operador2>20)?20:this.operador1+this.operador2;
                    break;
                case 2: //*
                    this.operador1 = Number(Math.floor(Math.random()*11));
                    this.operador2 = Number(Math.floor(Math.random()*11));
                    this.resultado = this.operador1 * this.operador2;
                    this.operacion = "x";
                    maxTiempoSegundos = ((this.operador1+this.operador2)>20)?20:this.operador1+this.operador2;
                    break;
                case 3: // /
                    break;
            }

            maxTiempoSegundos=20;
            //var maxTiempoSegundos = (this.resultado>20)?20:this.resultado;
            this.fin = Date.now()+ 4000 + (maxTiempoSegundos-(this.racha>maxTiempoSegundos?maxTiempoSegundos:this.racha))*1000;
            this.queda=Math.floor((this.fin-Date.now())/1000);
            this.respuesta='';

            this.$nextTick(function() {this.$refs.resp.focus()})



        },
        sonidoOk: function(){
            this.cargaSonido('sound/ok1.mp3');

        },
        sonidoFallo: function(){
            this.cargaSonido('sound/fail1.mp3');

        },
        cargaSonido: function cargaSonido (sonido) {
            var request = new XMLHttpRequest();
            var context = new AudioContext();
            request.open('GET', sonido, true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                var undecodedAudio = request.response;
                context.decodeAudioData(undecodedAudio, function (buffer) {
                    var sourceBuffer = context.createBufferSource();
                    sourceBuffer.buffer = buffer;
                    sourceBuffer.connect(context.destination);
                    sourceBuffer.start(context.currentTime);

                });
            };
            request.send();
        }
    }
});


var app = new Vue({
    el: '#app',
    data: {
        message: 'enganchado!',
        puntos: 37
    }
})