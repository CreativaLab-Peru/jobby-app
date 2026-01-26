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
    <section className="px-6 py-10 bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <CVListHeader disabledButton={disabledButton} />

          {cvs.length > 0 ? (
            <div className="rounded-3xl bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950 p-6 shadow-xl border border-gray-100 dark:border-blue-900">
              <CVGrid cvs={cvs} />
            </div>
          ) : (
            <div className="rounded-3xl bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950 p-10 shadow-xl border border-gray-100 dark:border-blue-900">
              <CVEmptyState />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
