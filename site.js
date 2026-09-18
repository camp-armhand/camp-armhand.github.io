"use strict";

const tasks = {
  task01: {title: "Wall Traversal", description: "Coordinate arm motion and finger articulation to traverse a wall-constrained environment.", success: "98.5", time: "3.40"},
  task03: {title: "Multi-Sphere Avoidance", description: "Adapt the arm route and hand configuration among multiple spherical obstacles.", success: "91.3", time: "4.70"},
  task04: {title: "Narrow Passage Traversal", description: "Coordinate the arm pose and hand shape to navigate a narrow passage.", success: "92.5", time: "30.10"},
  task07: {title: "Ball-in-Box Pregrasp", description: "Reach the prescribed pregrasp configuration through a constrained box opening. No grasp is performed in simulation.", success: "92.0", time: "32.40"},
  task08: {title: "Display Button Press", description: "Reach the prescribed button target while avoiding surrounding obstacles. The simulation does not model a physical button press.", success: "94.4", time: "35.60"},
  task09: {title: "Cabinet Cylinder Pregrasp", description: "Keep the hand compact through the cabinet opening, then adapt its shape near the cylinder to reach the pregrasp configuration.", success: "84.2", time: "42.60"}
};

const taskVideo = document.querySelector("#task-video");
const taskButtons = [...document.querySelectorAll("[data-task]")];
const mediaStatus = document.querySelector("#media-status");

const fiberGraphic = document.querySelector("#fiber-graphic");
const fiberReducedSource = document.querySelector("#fiber-reduced-motion");
const fiberToggle = document.querySelector("#fiber-animation-toggle");
if (fiberGraphic && fiberReducedSource && fiberToggle) {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let fiberPlaying = !motionPreference.matches;
  const setFiberAnimation = (playing) => {
    fiberPlaying = playing;
    const source = playing ? "assets/fibers-v40.gif" : "assets/fibers-v40-still.png";
    fiberGraphic.src = source;
    fiberReducedSource.srcset = source;
    fiberToggle.textContent = playing ? "Show still image" : "Play animation";
  };
  setFiberAnimation(fiberPlaying);
  fiberToggle.hidden = false;
  fiberToggle.addEventListener("click", () => setFiberAnimation(!fiberPlaying));
  motionPreference.addEventListener("change", (event) => setFiberAnimation(!event.matches));
}

if (document.querySelector("base")) {
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest("a") : null;
    const href = link?.getAttribute("href");
    if (!href?.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  });
}

taskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.getAttribute("aria-pressed") === "true") return;
    const id = button.dataset.task;
    const task = tasks[id];
    if (!task) return;
    taskVideo.pause();
    taskVideo.poster = `assets/sim-${id}.jpg`;
    taskVideo.querySelector("source").src = `assets/sim-${id}.mp4`;
    taskVideo.querySelector("a").href = `assets/sim-${id}.mp4`;
    taskVideo.setAttribute("aria-label", `${task.title} simulation demonstration`);
    taskVideo.load();
    document.querySelector("#task-title").textContent = task.title;
    document.querySelector("#task-description").textContent = task.description;
    document.querySelector("#task-success").firstChild.textContent = task.success;
    document.querySelector("#task-time").firstChild.textContent = task.time;
    document.querySelector("#task-download").href = `assets/sim-${id}.mp4`;
    taskButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    mediaStatus.hidden = true;
  });
});

const videos = [...document.querySelectorAll("video")];
videos.forEach((video) => {
  video.addEventListener("play", () => {
    mediaStatus.hidden = true;
    videos.forEach((other) => { if (other !== video) other.pause(); });
  });
  const showMediaError = () => {
    mediaStatus.textContent = "This video could not be loaded. Please reload the page or use its download link.";
    mediaStatus.hidden = false;
  };
  video.addEventListener("error", showMediaError);
  video.querySelectorAll("source").forEach((source) => source.addEventListener("error", showMediaError));
});

if ("IntersectionObserver" in window) {
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const visibleSections = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visibleSections.set(entry.target.id, entry.isIntersecting));
    const current = navLinks.find((link) => visibleSections.get(link.hash.slice(1)));
    navLinks.forEach((link) => {
      if (link === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, {rootMargin: "-15% 0px -45% 0px"});
  navLinks.forEach((link) => observer.observe(document.querySelector(link.hash)));
}
