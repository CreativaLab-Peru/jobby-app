"use client"

import useSWR from "swr"
import { useEffect } from "react"
import { Loader2, CheckCircle, XCircle, Clock, FileCheck } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

type CvStatus =
  | { status: "CV_IN_PROGRESS" }
  | { status: "CV_FAILED" }
  | { status: "CV_SUCCEEDED" }
  | { status: "CV_EVALUATION_PENDING_EVALUATION" }
  | { status: "CV_EVALUATION_IN_PROGRESS" }
  | { status: "CV_EVALUATION_FAILED" }
  | { status: "CV_EVALUATION_SUCCEEDED" }
  | { status: "CV_EVALUATION_FINISHED" }

interface ProgressStatusProps {
  cvId: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ProgressStatus({ cvId }: ProgressStatusProps) {
  const router = useRouter()

  const { data: status } = useSWR(`/api/cv/${cvId}/status`, fetcher, {
    refreshInterval: 3000,
  })

  useEffect(() => {
    if (status?.status === "CV_EVALUATION_FINISHED"
      || status?.status === "CV_EVALUATION_SUCCEEDED"
    ) {
      const evaluateId = status.evaluateId
      setTimeout(() => {
        router.push(`/evaluations/${evaluateId}`)
      }, 500)
    }
  }, [status, cvId, router])

  const renderContent = () => {
    if (!status) {
      return (
        <div className="text-center text-gray-500">
          <XCircle className="w-10 h-10 mx-auto text-red-500" />
          <p className="mt-2 font-medium">CV not found or access denied.</p>
        </div>
      )
    }

    switch (status.status) {
      case "CV_IN_PROGRESS":
        return (
          <div className="text-center">
            <Loader2 className="w-10 h-10 mx-auto text-blue-500 animate-spin" />
            <p className="mt-3 font-medium text-blue-700">
              Your CV is being processed...
            </p>
          </div>
        )

      case "CV_FAILED":
        return (
          <div className="text-center">
            <XCircle className="w-10 h-10 mx-auto text-red-500" />
            <p className="mt-3 font-medium text-red-700">
              The CV upload or processing failed.
            </p>
          </div>
        )

      case "CV_SUCCEEDED":
        return (
          <div className="text-center">
            <CheckCircle className="w-10 h-10 mx-auto text-green-500" />
            <p className="mt-3 font-medium text-green-700">
              Your CV was uploaded successfully.
            </p>
            <p className="text-gray-500 mt-1">
              Waiting to start evaluation...
            </p>
          </div>
        )

      case "CV_EVALUATION_PENDING_EVALUATION":
        return (
          <div className="text-center">
            <Clock className="w-10 h-10 mx-auto text-yellow-500" />
            <p className="mt-3 font-medium text-yellow-700">
              Your CV is pending evaluation.
            </p>
          </div>
        )

      case "CV_EVALUATION_IN_PROGRESS":
        return (
          <div className="text-center">
            <Loader2 className="w-10 h-10 mx-auto text-blue-500 animate-spin" />
            <p className="mt-3 font-medium text-blue-700">
              The CV evaluation is currently in progress...
            </p>
          </div>
        )

      case "CV_EVALUATION_FAILED":
        return (
          <div className="text-center">
            <XCircle className="w-10 h-10 mx-auto text-red-500" />
            <p className="mt-3 font-medium text-red-700">
              The evaluation process failed.
            </p>
          </div>
        )

      case "CV_EVALUATION_SUCCEEDED":
        return (
          <div className="text-center">
            <CheckCircle className="w-10 h-10 mx-auto text-green-500" />
            <p className="mt-3 font-medium text-green-700">
              The CV evaluation completed successfully.
            </p>
          </div>
        )

      case "CV_EVALUATION_FINISHED":
        return (
          <div className="text-center">
            <FileCheck className="w-10 h-10 mx-auto text-green-600" />
            <p className="mt-3 font-medium text-green-700">
              CV analysis finished — results ready to view.
            </p>
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-500">
            Unknown status: {(status as any).status}
          </div>
        )
    }
  }

  return (
    <Card className="max-w-lg w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800 text-center">
          CV Analysis Progress
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="py-10">{renderContent()}</CardContent>
    </Card>
  )
}
