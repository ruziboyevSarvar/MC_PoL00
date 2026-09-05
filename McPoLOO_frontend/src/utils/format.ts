export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US").format(value) + " so'm";
}

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
