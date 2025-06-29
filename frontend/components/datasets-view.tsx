"use client";

// React
import { useEffect, useState } from "react";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Copy,
  Database,
  ExternalLink,
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
      // You could add a toast notification here
      console.log("Syft URL copied to clipboard:", syftUrl);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleCopyCode = async (dataset: Dataset) => {
    const code = `import syft_datasets as syd\n\n# Get dataset: ${dataset.name}\ndataset = syd.datasets.search("${dataset.name}")[0]\nprint(f"Dataset: {dataset.name} from {dataset.email}")\nprint(f"Syft URL: {dataset.syft_url}")`;
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
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
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
            {searchTerm || selectedEmail 
              ? "Try adjusting your search or filter criteria"
              : "Make sure SyftBox is running and you have access to datasites"
            }
          </p>
          {(searchTerm || selectedEmail) && (
            <Button onClick={loadDatasets} variant="outline">
              Clear filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Syft-Datasets</h1>
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

      {/* Datasets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {datasets.map((dataset) => (
          <Card key={dataset.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-600 truncate">
                    {dataset.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {dataset.description || `Dataset from ${dataset.email}`}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Email */}
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{dataset.email}</span>
              </div>

              {/* Domain Tag */}
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {getDomainFromEmail(dataset.email)}
                </Badge>
              </div>

              {/* Tags */}
              {dataset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dataset.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopySyftUrl(dataset.syft_url)}
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-1" />
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
                        className="flex-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Copy Code
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Copy Python code to clipboard
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 