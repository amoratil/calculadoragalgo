
Vue.component ('visualizaciontiempo',{
    template:'<div>timegoesbysoslowly</div>',
    data: function() {
        return {
            dato:0
        }
    }
});

Vue.component('visualizacioncalculadora', {
    template: '<div><div>Puntos: <strong>{{puntos}}</strong>. Quedan {{queda}} segundos.</div>' +
    '<div>Repuestas seguidas: <strong>{{racha}}</strong> (mejor racha: {{rachamax}}).</div>'+
    '<div>Total operaciones: <strong>{{contador-1}}</strong>. Correctas: <strong>{{correctas}}</strong>. Fallidas: <strong>{{fallidas}}</strong>.</div>'+
    '<div><h3><span class="primero">{{operador1}}</span><span class="operacion">{{operacion}}</span><span class="segundo">{{operador2}}</span>' +
    '&nbsp; &nbsp; ' +
    '<input type="tel" min="0" max="10000" ref="resp" v-model="respuesta"></div></h3>' +
    '<h4 v-show="racha === 0">Último error: {{correccion}}</h4></div></div>',
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
            rachamax:0,
            queda:0,
            correccion:'',
            correctas:0,
            fallidas:0
        }
    },
    watch: {
        // whenever question changes, this function will run
        respuesta: function (antes, ahora) {
            if (Number(antes)===this.resultado){
                this.sonidoOk();
                this.racha++;
                this.rachamax=(this.racha>this.rachamax)?this.racha:this.rachamax;
                this.puntos=Math.ceil(this.puntos + this.racha * this.resultado/5);
                //ahora avanzaríamos en el contador y a ver qué nos toca.
                this.correccion='';
                this.correctas++;
                this.avanzaPregunta();
            }


        }
    },
    created: function () {

        this.timer = setInterval(this.updateTiempo,200);
        this.avanzaPregunta();


        this.audioMgr = new AudioManager({
            ok1:      { filename: "sound/ok1.mp3",      samples: 1 },
            ok2:      { filename: "sound/ok2.mp3",      samples: 1 },
            ok3:      { filename: "sound/ok3.mp3",      samples: 1 },
            ok4:      { filename: "sound/ok4.mp3",      samples: 1 },
            ok5:      { filename: "sound/ok5.mp3",      samples: 1 },
            fail1:    { filename: "sound/fail1.mp3",    samples: 1 },
            fail2:    { filename: "sound/fail2.mp3",    samples: 1 },
            fail3:    { filename: "sound/fail3.mp3",    samples: 1 },
            fail4:    { filename: "sound/fail4.mp3",    samples: 1 },
            fail5:    { filename: "sound/fail5.mp3",    samples: 1 },
            fail6:    { filename: "sound/fail6.mp3",    samples: 1 },

     });


    },
    methods: {

        updateTiempo: function(){
            this.$nextTick(function() {this.$refs.resp.focus()})
            this.queda=Math.floor((this.fin-Date.now())/1000);
            if (this.queda < 0) {
                this.correccion = ""+this.operador1+this.operacion+this.operador2+" = "+this.resultado;
                this.racha=0;
                this.fallidas++;
                this.sonidoFallo();
                this.avanzaPregunta();
            }
        },
        avanzaPregunta: function(){
            var maxTiempoSegundos=20;
            switch (Math.floor(Math.random()*2+2)){
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
                    this.operador1 = Number(Math.floor(Math.random()*11));
                    this.operador2 = Number(Math.floor(Math.random()*11));
                    this.resultado = this.operador1 * this.operador2;
                    this.operacion = "x";
                    maxTiempoSegundos = ((this.operador1+this.operador2)>20)?20:this.operador1+this.operador2;
                    break;
            }

            maxTiempoSegundos=10;
            //var maxTiempoSegundos = (this.resultado>20)?20:this.resultado;
            this.fin = Date.now()+ 4000 + (maxTiempoSegundos-(this.racha>maxTiempoSegundos?maxTiempoSegundos:this.racha))*1000;
            this.queda=Math.floor((this.fin-Date.now())/1000);
            this.respuesta='';
            this.contador++;

            this.$nextTick(function() {this.$refs.resp.focus()})



        },
        sonidoOk: function(){

            switch(Math.floor(Math.random()*5)) {
                case 0:
                    this.audioMgr.playSound('ok1');
                    break;
                case 1:
                    this.audioMgr.playSound('ok2');
                    break;
                case 2:
                    this.audioMgr.playSound('ok3');
                    break;
                case 3:
                    this.audioMgr.playSound('ok4');
                    break;
                case 4:
                    this.audioMgr.playSound('ok5');
                    break;
            }

            //this.audioMgr.playSound('ok2');
            //this.cargaSonido('sound/ok1.mp3');

        },
        sonidoFallo: function(){
            switch(Math.floor(Math.random()*6)) {
                case 0:
                    this.audioMgr.playSound('fail1');
                    break;
                case 1:
                    this.audioMgr.playSound('fail2');
                    break;
                case 2:
                    this.audioMgr.playSound('fail3');
                    break;
                case 3:
                    this.audioMgr.playSound('fail4');
                    break;
                case 4:
                    this.audioMgr.playSound('fail5');
                    break;
                case 5:
                    this.audioMgr.playSound('fail6');
                    break;
            }
            //this.audioMgr.playSound('fail3');

            //this.cargaSonido('sound/fail1.mp3');

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