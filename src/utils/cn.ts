/** 조건부 className 결합: cn('button', isActive && 'button--active') */
export function cn(...classNames: Array<string | false | null | undefined>): string {
  return classNames.filter(Boolean).join(' ');
}
