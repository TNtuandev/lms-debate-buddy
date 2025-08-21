import React from 'react';
import {Badge, BadgeProps} from './badge';
import {cn} from '@/lib/utils';

export interface NotificationBadgeProps extends BadgeProps {
  label?: string | number;
  show?: boolean;
}

export const NotificationBadge = ({
                                    label,
                                    className,
                                    show,
                                    children,
                                    ...props
                                  }: NotificationBadgeProps) => {
  const showBadge =
    typeof label !== 'undefined' && (typeof show === 'undefined' || show);
  return (
    <div className='inline-flex relative'>
      {children}
      {showBadge && (
        <Badge
          className={cn(
            'absolute bg-secondary-main h-5 w-5 top-0 right-0 rounded-full text-primary-contrastText text-xs',
            typeof label !== 'undefined' && ('' + label).length === 0
              ? 'translate-x-1 -translate-y-1 px-1 py-1.5'
              : 'translate-x-0 -translate-y-1 px-1.5 py-0.5',
            className
          )}
          {...props}
        >
          {'' + label}
        </Badge>
      )}
    </div>
  );
};