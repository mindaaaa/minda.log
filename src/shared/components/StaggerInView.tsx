import { Children, isValidElement, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export interface StaggerInViewProps {
  children: ReactNode;
  className?: string;
  /** 자식 요소 사이 간격(초). 기본 0.2 */
  stagger?: number;
  /** 등장 전 Y 오프셋(px). 기본 20 */
  y?: number;
  /** 트리거 시점: 뷰포트에 얼마나 들어왔을 때 시작할지 */
  amount?: number | "some" | "all";
  once?: boolean;
  /** 각 스태거 래퍼(motion.div)에 붙는 클래스 */
  itemClassName?: string;
  /** 각 항목 애니메이션 지속 시간(초) */
  duration?: number;
}

/**
 * 스크롤 진입 시 자식을 순차(opacity 0→1, y↑)로 드러냅니다.
 * Framer Motion whileInView + staggerChildren.
 */
export default function StaggerInView({
  children,
  className = "",
  stagger = 0.2,
  y = 20,
  amount = 0.2,
  once = true,
  itemClassName = "",
  duration = 0.48,
}: StaggerInViewProps) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : stagger,
        delayChildren: reduce ? 0 : 0.02,
      },
    },
  };

  const item: Variants = {
    hidden: {
      opacity: reduce ? 1 : 0,
      y: reduce ? 0 : y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const list = Children.toArray(children);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={container}
    >
      {list.map((child, i) => {
        const key = isValidElement(child) && child.key != null ? String(child.key) : `stagger-${i}`;
        return (
          <motion.div key={key} variants={item} className={itemClassName}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
