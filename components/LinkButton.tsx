import React, { forwardRef, Ref } from "react";
import Link, { LinkProps } from "next/link";
import { Button, ButtonProps } from "@mui/material";

type LinkRef = HTMLButtonElement;
type NextLinkProps = Omit<ButtonProps, "href"> &
  Pick<LinkProps, "href" | "as" | "prefetch" | "locale" | "shallow">;

const NextLink = (
  { href, as, prefetch, locale, shallow, ...props }: LinkProps,
  ref: Ref<LinkRef>
) => (
  <Link
    href={href}
    as={as}
    prefetch={prefetch}
    locale={locale}
    shallow={shallow}
    passHref
  >
    <Button ref={ref} {...props} />
  </Link>
);

export default forwardRef<LinkRef, NextLinkProps>(NextLink);
