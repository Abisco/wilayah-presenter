import React from 'react';
import * as TooltipPrimative from '@radix-ui/react-tooltip';

const { Root, Trigger, Content, Arrow, Portal, Provider } = TooltipPrimative;

interface TooltipProps {
  children: React.ReactNode;
  text?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip = ({
  children,
  text,
  side = 'top',
}: TooltipProps) => {

  if (text) {
    return (
      <Provider>
        <Root>
          <Trigger asChild>
            {children}
          </Trigger>
          <Portal>
            <Content side={side} className="bg-white rounded text-black py-2 px-3 shadow-md" sideOffset={5}>
              {text}
              <Arrow className="fill-white" />
            </Content>
          </Portal>
        </Root>
      </Provider>
    );
  }

  return (
    <>{children}</>
  )

};