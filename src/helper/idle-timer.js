class IdleTimer {
  constructor({ timeout, onTimeout, onExpired }) {
    this.timeout = timeout;
    this.onTimeout = onTimeout;
    this.onExpired = onExpired;

    const expiredTime = parseInt(localStorage.getItem("_expiredTime"));
    if (expiredTime > 0 && expiredTime < Date.now()) {
      this.onExpired();
      return;
    }

    this.eventHandler = this.updateExpiredTime.bind(this);
    this.tracker();
    this.startInterval();
  }

  startInterval() {
    this.updateExpiredTime();

    this.interval = setInterval(() => {
      const expiredTime = parseInt(
        localStorage.getItem("_expiredTime") 
        
      );
      if (expiredTime < Date.now()) {
        if (this.onTimeout) {
          this.onTimeout();
          this.cleanUp();
        }
      }
    }, 1000);
  }

  updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      localStorage.setItem("_expiredTime", Date.now() + this.timeout * 1000);
    }, 300);
  }

  tracker() {
    window.addEventListener("mousemove", this.eventHandler);
    window.addEventListener("scroll", this.eventHandler);
    window.addEventListener("keydown", this.eventHandler);
    window.addEventListener("click", this.eventHandler);
    window.addEventListener("touchstart", this.eventHandler);
    window.addEventListener("touchmove", this.eventHandler);
    window.addEventListener("touchend", this.eventHandler);
    window.addEventListener("touchcancel", this.eventHandler);
    window.addEventListener("touchleave", this.eventHandler);
    window.addEventListener("touchforcechange", this.eventHandler);
  }

  cleanUp() {
    clearInterval(this.interval);
    window.removeEventListener("mousemove", this.eventHandler);
    window.removeEventListener("scroll", this.eventHandler);
    window.removeEventListener("keydown", this.eventHandler);
    window.removeEventListener("click", this.eventHandler);
    window.removeEventListener("touchstart", this.eventHandler);
    window.removeEventListener("touchmove", this.eventHandler);
    window.removeEventListener("touchend", this.eventHandler);
    window.removeEventListener("touchcancel", this.eventHandler);
    window.removeEventListener("touchleave", this.eventHandler);
    window.removeEventListener("touchforcechange", this.eventHandler);
  }
}
export default IdleTimer;
