import { defineField, defineType } from "sanity";

const settings = defineType({
  name: "siteSettings", title: "Настройки сайта", type: "document",
  fields: [
    defineField({name:"brand", title:"Название",type:"string"}),
    defineField({name:"location",title:"Локация",type:"string"}),
    defineField({name:"tagline",title:"Слоган",type:"string"}),
    defineField({name:"intro",title:"Обо мне",type:"text",rows:5}),
    defineField({name:"telegram",title:"Ссылка Telegram",type:"url"}),
    defineField({name:"whatsapp",title:"Ссылка WhatsApp",type:"url"}),
    defineField({name:"email",title:"Email",type:"string"}),
    defineField({name:"videoArchive",title:"Ссылка на видеоархив",type:"url"}),
  ],
  preview:{prepare:()=>({title:"Главная / Контакты / Настройки"})},
});
const musicTrack = defineType({
 name:"musicTrack",title:"Музыка",type:"document",
 fields:[
 defineField({name:"title",title:"Название микса",type:"string",validation: r=>r.required()}),
 defineField({name:"category",title:"Жанр / подпись",type:"string"}),
 defineField({name:"length",title:"Продолжительность (например 45:00)",type:"string"}),
 defineField({name:"audio",title:"Аудиофайл",type:"file",options:{accept:"audio/*"}}),
 defineField({name:"url",title:"Внешняя ссылка (если нет файла)",type:"url"}),
 defineField({name:"order",title:"Порядок",type:"number",initialValue:10}),
 ],preview:{select:{title:"title",subtitle:"category"}}
});
const videoItem = defineType({name:"videoItem",title:"Видео",type:"document",fields:[
 defineField({name:"title",title:"Название видео",type:"string",validation:r=>r.required()}),
 defineField({name:"url",title:"Ссылка на видео (YouTube, Vimeo, Drive)",type:"url",validation:r=>r.required()}),
 defineField({name:"order",title:"Порядок",type:"number",initialValue:10}),
 ]});
const photoItem = defineType({name:"photoItem",title:"Фото",type:"document",fields:[
 defineField({name:"name",title:"Название кадра",type:"string",validation:r=>r.required()}),
 defineField({name:"image",title:"Фотография",type:"image",options:{hotspot:true},validation:r=>r.required()}),
 defineField({name:"alt",title:"Описание фото (для доступности)",type:"string"}),
 defineField({name:"category",title:"Категория",type:"string",options:{list:["EVENTS","BACKSTAGE","DETAILS"]},initialValue:"EVENTS"}),
 defineField({name:"order",title:"Порядок",type:"number",initialValue:10}),
 ],preview:{select:{title:"name",media:"image",subtitle:"category"}}});
const achievement = defineType({name:"achievement",title:"Достижения",type:"document",fields:[
 defineField({name:"year",title:"Год",type:"string"}),
 defineField({name:"title",title:"Название",type:"string",validation:r=>r.required()}),
 defineField({name:"detail",title:"Описание",type:"text"}),
 defineField({name:"order",title:"Порядок",type:"number",initialValue:10}),
 ]});
const client = defineType({name:"client",title:"Клиенты",type:"document",fields:[
 defineField({name:"name",title:"Имя клиента",type:"string",validation:r=>r.required()}),
 defineField({name:"order",title:"Порядок",type:"number",initialValue:10}),
 ]});
export const schemaTypes = [settings,musicTrack,videoItem,photoItem,achievement,client];
