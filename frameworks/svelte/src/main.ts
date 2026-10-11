import "@guiexpert/table/css/main.css";
import "../../../src/style.css";
import { mount } from "svelte";
import App from "./App.svelte";

mount(App, { target: document.getElementById("app")! });
