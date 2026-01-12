"use client"

import { motion } from "framer-motion"
import { CVListHeader } from "./cv-list-header"
import { CVGrid } from "./cv-grid"
import { CVEmptyState } from "./cv-empty-state"
import { CvWithRelations } from "../actions/get-cv-for-current-user"

interface CvListProps {
  cvs: CvWithRelations[]
  disabledButton?: boolean
}

export function CvListScreen({ cvs, disabledButton }: CvListProps) {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <CVListHeader disabledButton={disabledButton} />

          {cvs.length > 0 ? (
            <div className="rounded-2xl bg-card p-4 shadow-sm border">
              <CVGrid cvs={cvs} />
            </div>
          ) : (
            <div className="rounded-2xl bg-card p-6 shadow-sm border">
              <CVEmptyState />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
