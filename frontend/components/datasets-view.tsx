"use client";

// React
import { useEffect, useState } from "react";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
  Calendar,
  Copy,
  Database,
  ExternalLink,
  HardDrive,
  Mail,
  Search,
  Tag,
  User,
} from "lucide-react";

// Utils
import { apiService, type Dataset } from "@/lib/api";
import { copyToClipboard, getDomainFromEmail, timeAgo } from "@/lib/utils";

export function DatasetsView() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string>("all");
  const [uniqueEmails, setUniqueEmails] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDatasets();
      setDatasets(response.datasets);
      setUniqueEmails(response.unique_emails);
      setTotalCount(response.total_count);
    } catch (error) {
      console.error("Failed to load datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDatasets();
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.searchDatasets(searchTerm);
      setDatasets(response.datasets);
      setTotalCount(response.total_count);
    } catch (error) {
      console.error("Failed to search datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFilter = async (email: string) => {
    setSelectedEmail(email);
    if (email === "all") {
      loadDatasets();
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.filterByEmail(email);
      setDatasets(response.datasets);
      setTotalCount(response.total_count);
    } catch (error) {
      console.error("Failed to filter datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySyftUrl = async (syftUrl: string) => {
    try {
      await copyToClipboard(syftUrl);
      console.log("Syft URL copied to clipboard:", syftUrl);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleCopyCode = async (dataset: Dataset) => {
    const code = `import syft_datasets as syd

# Get dataset: ${dataset.name}
dataset = syd.datasets.search("${dataset.name}")[0]
print(f"Dataset: {dataset.name} from {dataset.email}")
print(f"Syft URL: {dataset.syft_url}")`;
    try {
      await copyToClipboard(code);
      console.log("Code copied to clipboard");
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-5 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="flex space-x-4">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-28"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
            <Database className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No datasets found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedEmail !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Make sure SyftBox is running and you have access to datasites"
            }
          </p>
          {(searchTerm || selectedEmail !== "all") && (
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedEmail("all");
                loadDatasets();
              }} 
              variant="outline"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Datasets</h1>
          <p className="text-muted-foreground">
            Discover and explore datasets in the SyftBox ecosystem
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {totalCount} dataset{totalCount !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search datasets by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedEmail} onValueChange={handleEmailFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by email" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All emails</SelectItem>
            {uniqueEmails.map((email) => (
              <SelectItem key={email} value={email}>
                {email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="w-full sm:w-auto">
          Search
        </Button>
      </div>

      {/* Datasets List */}
      <div className="space-y-4">
        {datasets.map((dataset) => (
          <Card key={dataset.id} className="hover:shadow-md transition-shadow border border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                {/* Left side content */}
                <div className="flex-1 space-y-3">
                  {/* Title and badge */}
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                      {dataset.name}
                    </h3>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900"
                          >
                            ● {dataset.type.toUpperCase()}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          Dataset format: {dataset.type.toUpperCase()}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm">
                    {dataset.description}
                  </p>

                  {/* Metadata row */}
                  <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="whitespace-nowrap">
                              {dataset.email}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Dataset owner email
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span className="whitespace-nowrap">
                              Updated {timeAgo(dataset.updated_at)}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Last updated on{" "}
                          {new Date(dataset.updated_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1">
                            <HardDrive className="h-4 w-4 shrink-0" />
                            <span className="whitespace-nowrap">
                              {dataset.size}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Dataset size
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-muted"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="ml-8 flex flex-col space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopySyftUrl(dataset.syft_url)}
                          className="w-full"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Copy SyftBox URL to clipboard
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyCode(dataset)}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Copy Code
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Copy Python code to clipboard
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 