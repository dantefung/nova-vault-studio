const links = [...document.querySelectorAll(".nav-links a, .page-outline a")];
const targets = [
  ...new Set(
    links
      .map((link) => link.getAttribute("href"))
      .filter((href) => href?.startsWith("#"))
      .map((href) => href.slice(1))
  ),
]
  .map((id) => document.getElementById(id))
  .filter(Boolean)
  .sort((a, b) => a.offsetTop - b.offsetTop);

function currentTargetId() {
  let current = "top";

  targets.forEach((target) => {
    if (target.getBoundingClientRect().top <= 140) {
      current = target.id;
    }
  });

  return current;
}

function updateCurrentLinks() {
  const current = currentTargetId();

  links.forEach((link) => {
    if (link.getAttribute("href") === `#${current}`) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

let ticking = false;

function queueCurrentUpdate() {
  if (ticking) return;

  ticking = true;
  requestAnimationFrame(() => {
    updateCurrentLinks();
    ticking = false;
  });
}

window.addEventListener("scroll", queueCurrentUpdate, { passive: true });
window.addEventListener("resize", queueCurrentUpdate);
window.addEventListener("hashchange", queueCurrentUpdate);
updateCurrentLinks();
