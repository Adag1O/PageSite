/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    subdomain?: string | null;
    isDemoSubdomain?: boolean;
  }
}
