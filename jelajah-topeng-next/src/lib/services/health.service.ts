export function getHealth() {
  return {
    status: "ok",
    service: "jelajah-topeng-web",
    time: new Date().toISOString(),
  };
}