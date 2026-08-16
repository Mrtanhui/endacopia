import type { ComponentPropsWithoutRef } from "react";

type InternalLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
};

export default function InternalLink({ children, ...props }: InternalLinkProps) {
  return <a {...props}>{children}</a>;
}
