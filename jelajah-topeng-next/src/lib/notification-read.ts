"use client";

import { useSyncExternalStore } from "react";

// Status "sudah dibaca" notifikasi disimpan per browser (localStorage).
const KEY = "jt-read-notifications";
const EVENT = "jt-read-notifications-change";
const MAX_IDS = 500;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

function parse(raw: string): Set<string> {
  try {
    const list: unknown = JSON.parse(raw || "[]");
    return new Set(
      Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [],
    );
  } catch {
    return new Set();
  }
}

// Tandai notifikasi sebagai sudah dibaca.
export function markRead(ids: string[]) {
  if (!ids.length) return;
  try {
    const merged = [...parse(getSnapshot()), ...ids];
    const unique = [...new Set(merged)].slice(-MAX_IDS);
    window.localStorage.setItem(KEY, JSON.stringify(unique));
  } catch {
    // localStorage tidak tersedia: abaikan, badge tetap tampil.
  }
  window.dispatchEvent(new Event(EVENT));
}

// Daftar id notifikasi yang sudah dibaca (otomatis ikut berubah).
export function useReadIds(): Set<string> {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return parse(raw);
}