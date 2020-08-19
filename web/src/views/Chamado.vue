<template>
    <div id="page-chamado">
        <div class="background"></div>
        <header><h1>Abertura de Chamados</h1></header>
            <main>
                <form enctype="multipart/form-data">
                    <div class="form-group">
                    <label for="agencia">Agência</label>
                    <select v-on:change="mudarAgencia" name="agencia" class="form-control" type="text" v-model="agencia">
                        <option selected value="dks">DKS</option>
                        <option value="vmo">VMO</option>
                        <option value="glw">GLW</option>
                    </select>
                    </div>
                    <div class="form-group">
                        <label for="demandante">Demandante</label>
                        <input name="demandante" class="form-control" type="text" v-model="demandante"/>
                    </div>
                    <div class="form-group">
                        <label for="material">Material solicitado</label>
                        <input name="material" class="form-control" type="text" v-model="material"/>
                    </div>
                    <div class="form-group">
                        <label for="data-limite">Data limite para entrega</label>
                        <input name="data-limite" class="form-control" type="text" v-model="dataLimite"/>
                    </div>
                    <div class="form-group">
                        <label for="comentario">Comente sobre a solicitação</label>
                        <textarea name="comentario" class="form-control" v-model="comentario"/>
                    </div>
                    <div class="form-group">
                        <label for="arquivos">Fazer upload dos arquivos</label>
                        <input name="arquivos" type="file" accept=".png, .jpg, .jpeg"/>
                    </div>
                    <div class="btn-center">
                        <button type="submit" class="btn btn-primary" v-on:click="enviarDados">ENVIAR SOLICITAÇÃO</button>
                    </div>
                </form>
            </main>
            <footer><img src="../assets/dks.png"/></footer>
    </div>
</template>

<script>
import dks from '../assets/dks.png';
import vmo from '../assets/vmo.png';
import glw from '../assets/glw.png';

import axios from 'axios';

export default {
    data(){
        return {
            agencia: '',
            demandante: '',
            material: '',
            dataLimite: '',
            comentario: ''
        }
    },

    methods:{
        mudarAgencia(event) {
            const img = document.querySelector("footer img"); 
            const button = document.querySelector("button[type=submit]");

            switch(event.target.value){
                case "dks":{
                    img.src = dks;
                    button.style.backgroundColor = "var(--color-dks)";
                    break;
                }
                case "vmo":{
                    img.src = vmo;
                    button.style.backgroundColor = "var(--color-vmo)";
                    break;
                }
                case "glw":{
                    img.src = glw;
                    button.style.backgroundColor = "var(--color-glw)";
                    break;
                }
                default:{
                    img.src = dks;
                    break;
                }
            }
        },

        enviarDados(event){
            event.preventDefault();
            const data = {

            }
        }
    }

}
</script>

<style scoped>
    #page-chamado {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 40px;
        margin: auto;
    }

    #page-chamado .background{
        position: fixed;
        z-index: -3;
        background-image: url("../assets/background.png");
        object-fit: cover;
        background-size: 100vw;
        height: 100vh;
        width: 100vw;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    #page-chamado header{
        margin-bottom: 20px;
    }

    #page-chamado header h1{
        font-weight: bolder;
    } 

    #page-chamado main{
        width: 100%;
        max-width: 600px;
    }

    #page-chamado form .form-group{
        width: 100%;
        margin-bottom: 6px;
    }

    #page-chamado form .form-group input[type=file]{
        display: block;
    }

    #page-chamado form button{
        background-color: var(--color-dks);
        border: none;
        font-weight: bolder;
        font-size: 26px;
        border-radius: 6px;
        margin: 40px 0;
    }
    
    #page-chamado form .btn-center{
        text-align: center;
        margin-top: 16px;
    }

    #page-chamado footer img{
        margin-top: 16px;
        width: 128px;
    }

    #page-chamado footer{
        text-align: center;
    }
</style>