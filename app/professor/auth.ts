import "server-only";
import {cookies} from "next/headers";
const COOKIE_NAME="eyroff_professor",DURATION=60*60*12;
function secret(){return process.env.ADMIN_SESSION_SECRET??""}
function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("")}
export async function hashPassword(password:string,salt:string){const passwordSecret=secret();if(!passwordSecret)throw new Error("ADMIN_SESSION_SECRET não configurado");const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(passwordSecret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return hex(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(`${salt}:${password}`)))}
async function hmac(value:string){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret()),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return hex(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value)))}
async function equal(a:string,b:string){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0}
export async function createProfessorCookie(id:number){const expires=Math.floor(Date.now()/1000)+DURATION,payload=`${id}:${expires}`;return{name:COOKIE_NAME,value:`${payload}.${await hmac(payload)}`,maxAge:DURATION}}
export async function getProfessorId(){const value=(await cookies()).get(COOKIE_NAME)?.value;if(!value)return null;const dot=value.lastIndexOf("."),payload=value.slice(0,dot),signature=value.slice(dot+1),[id,expires]=payload.split(":");if(!id||Number(expires)<Math.floor(Date.now()/1000)||!await equal(signature,await hmac(payload)))return null;return Number(id)}
export {COOKIE_NAME};
