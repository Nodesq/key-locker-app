"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  X, 
  Search, 
  Calendar, 
  User, 
  Key,
  Eye,
  EyeOff
} from "lucide-react";

// Types
type KeyStatus = "available" | "in-use";

interface CarKey {
  id: string;
  carModel: string;
  licensePlate: string;
  status: KeyStatus;
  holder?: string;
  lastUpdated: Date;
}

interface Transaction {
  id: string;
  keyId: string;
  action: "check-out" | "check-in";
  user: string;
  timestamp: Date;
}

// Initial data
const initialCarKeys: CarKey[] = [
  { id: "CK001", carModel: "Toyota Camry", licensePlate: "ABC-123", status: "available", lastUpdated: new Date() },
  { id: "CK002", carModel: "Honda Civic", licensePlate: "XYZ-789", status: "in-use", holder: "John Smith", lastUpdated: new Date(Date.now() - 3600000) },
  { id: "CK003", carModel: "Ford F-150", licensePlate: "DEF-456", status: "available", lastUpdated: new Date() },
  { id: "CK004", carModel: "Tesla Model 3", licensePlate: "TES-123", status: "in-use", holder: "Sarah Johnson", lastUpdated: new Date(Date.now() - 7200000) },
  { id: "CK005", carModel: "BMW X5", licensePlate: "BMW-987", status: "available", lastUpdated: new Date() },
  { id: "CK006", carModel: "Chevrolet Silverado", licensePlate: "CHE-456", status: "in-use", holder: "Mike Wilson", lastUpdated: new Date(Date.now() - 10800000) },
  { id: "CK007", carModel: "Audi A4", licensePlate: "AUD-321", status: "available", lastUpdated: new Date() },
  { id: "CK008", carModel: "Mercedes C-Class", licensePlate: "MER-654", status: "available", lastUpdated: new Date() },
];

const initialTransactions: Transaction[] = [
  { id: "T001", keyId: "CK002", action: "check-out", user: "John Smith", timestamp: new Date(Date.now() - 3600000) },
  { id: "T002", keyId: "CK004", action: "check-out", user: "Sarah Johnson", timestamp: new Date(Date.now() - 7200000) },
  { id: "T003", keyId: "CK006", action: "check-out", user: "Mike Wilson", timestamp: new Date(Date.now() - 10800000) },
];

export default function CarKeyManagementApp() {
  // State
  const [carKeys, setCarKeys] = useState<CarKey[]>(initialCarKeys);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKey, setSelectedKey] = useState<CarKey | null>(null);
  const [userName, setUserName] = useState("");
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // Filter keys based on search term
  const filteredKeys = carKeys.filter(key => 
    key.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (key.holder && key.holder.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle check-out
  const handleCheckOut = () => {
    if (!selectedKey || !userName.trim()) return;

    const updatedKeys = carKeys.map(key => 
      key.id === selectedKey.id 
        ? { 
            ...key, 
            status: "in-use", 
            holder: userName,
            lastUpdated: new Date()
          } 
        : key
    );

    const newTransaction: Transaction = {
      id: `T${transactions.length + 1}`.padStart(4, '0'),
      keyId: selectedKey.id,
      action: "check-out",
      user: userName,
      timestamp: new Date()
    };

    setCarKeys(updatedKeys);
    setTransactions([newTransaction, ...transactions]);
    setUserName("");
    setIsCheckOutOpen(false);
  };

  // Handle check-in
  const handleCheckIn = (keyId: string) => {
    const keyToCheckIn = carKeys.find(key => key.id === keyId);
    if (!keyToCheckIn || keyToCheckIn.status !== "in-use") return;

    const updatedKeys = carKeys.map(key => 
      key.id === keyId 
        ? { 
            ...key, 
            status: "available", 
            holder: undefined,
            lastUpdated: new Date()
          } 
        : key
    );

    const newTransaction: Transaction = {
      id: `T${transactions.length + 1}`.padStart(4, '0'),
      keyId: keyId,
      action: "check-in",
      user: keyToCheckIn.holder || "Unknown",
      timestamp: new Date()
    };

    setCarKeys(updatedKeys);
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Car Key Management System</h1>
          <p className="text-gray-600">Track and manage car key check-in/check-out status</p>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by key ID, car model, license plate, or driver..."
              className="pl-10 py-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Key className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Keys</p>
                  <p className="text-2xl font-bold">{carKeys.filter(k => k.status === "available").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-red-100 p-3 mr-4">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Keys in Use</p>
                  <p className="text-2xl font-bold">{carKeys.filter(k => k.status === "in-use").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Toggle Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowInventory(!showInventory)}
            className="w-full md:w-auto"
          >
            {showInventory ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Car Keys Inventory
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Car Keys Inventory
              </>
            )}
          </Button>
        </div>

        {/* Key Grid - Only shown when button is pressed */}
        {showInventory && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Car Keys Inventory</h2>
              <Button 
                variant="outline" 
                onClick={() => setIsHistoryOpen(true)}
              >
                View Transaction History
              </Button>
            </div>
            
            {filteredKeys.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No car keys found matching your search.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredKeys.map(key => (
                  <Card key={key.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{key.id}</CardTitle>
                        <Badge 
                          variant="secondary" 
                          className={key.status === "available" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"}
                        >
                          {key.status === "available" ? "Available" : "In Use"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <p className="font-medium text-gray-900">{key.carModel}</p>
                        <p className="text-sm text-gray-600">License: {key.licensePlate}</p>
                      </div>
                      
                      {key.status === "in-use" ? (
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium">Driver:</span>
                            <span className="ml-1">{key.holder}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium">Since:</span>
                            <span className="ml-1">{key.lastUpdated.toLocaleString()}</span>
                          </div>
                          <Button 
                            className="w-full mt-2 bg-red-600 hover:bg-red-700"
                            onClick={() => handleCheckIn(key.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Return Key
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Last updated: {key.lastUpdated.toLocaleString()}</span>
                          </div>
                          <Button 
                            className="w-full mt-2"
                            onClick={() => {
                              setSelectedKey(key);
                              setIsCheckOutOpen(true);
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Take Key
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {transactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {transaction.action === "check-out" ? (
                          <span className="text-red-600">Key taken</span>
                        ) : (
                          <span className="text-green-600">Key returned</span>
                        )}{" "}
                        ({transaction.keyId})
                      </div>
                      <div className="text-sm text-gray-600">By: {transaction.user}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
              {transactions.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No transactions recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Check Out Modal */}
        {isCheckOutOpen && selectedKey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Take Car Key</h3>
                  <button 
                    onClick={() => {
                      setIsCheckOutOpen(false);
                      setSelectedKey(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keyId">Key ID</Label>
                    <Input id="keyId" value={selectedKey.id} disabled />
                  </div>
                  <div>
                    <Label htmlFor="carModel">Car Model</Label>
                    <Input id="carModel" value={selectedKey.carModel} disabled />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input id="licensePlate" value={selectedKey.licensePlate} disabled />
                  </div>
                  <div>
                    <Label htmlFor="userName">Driver Name</Label>
                    <Input 
                      id="userName" 
                      placeholder="Enter name of driver taking the key"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleCheckOut}
                    disabled={!userName.trim()}
                  >
                    Confirm Key Take
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {isHistoryOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Transaction History</h3>
                  <button 
                    onClick={() => setIsHistoryOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto flex-grow">
                <div className="p-6 space-y-4">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {transaction.action === "check-out" ? (
                            <span className="text-red-600">Key taken</span>
                          ) : (
                            <span className="text-green-600">Key returned</span>
                          )}{" "}
                          ({transaction.keyId})
                        </span>
                        <span className="text-sm text-gray-500">
                          {transaction.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">By: {transaction.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}