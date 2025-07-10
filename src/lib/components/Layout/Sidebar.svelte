<script lang="ts">
    import { page } from '$app/state';
	import { BarChart3, Calendar, FileText, Package, Settings, Truck, Users } from '@lucide/svelte';

    let { sidebarCollapsed = false } = $props();

    const sidebarItems = [
        {
            section: 'GENERAL',
            items: [{
                name: 'Dashboard',
                href: '/',
                active: true
            }]
        },
        {
            section: 'OPERATIONS',
            items: [
                {
                    name: 'Schedule Collect',
                    href: '/schedule-collect',
                },
                {
                    name: 'Collects History',
                    href: '/collects-history',
                },
                {
                    name: 'Waybill',
                    href: '/waybill',
                },
                {
                    name: 'Report',
                    href: '/operations-report',
                }
            ]
        },
        {
            section: 'WASTE MANAGEMENT',
            items: [
                {
                    name: 'Wastes',
                    href: '/wastes'
                },
                {
                    name: 'Report',
                    href: '/waste-report'
                }
            ]
        },
        {
            section: 'FLEET MANAGEMENT',
            items: [
                {
                    name: 'Vehicles',
                    href: '/vehicles'
                },
                {
                    name: 'Drivers',
                    href: '/drivers'
                },
                {
                    name: 'Report',
                    href: '/fleet-report'
                }
            ]
        },
        {
            section: 'CLIENT MANAGEMENT',
            items: [
                {
                    name: 'Producers',
                    href: '/producers'
                },
                {
                    name: 'Contract',
                    href: '/client-contract'
                },
                {
                    name: 'Report',
                    href: '/client-report'
                }
            ]
        },
        {
            section: 'PROVIDERS MANAGEMENT',
            items: [
                {
                    name: 'Contract',
                    href: '/provider-contract'
                },
                {
                    name: 'Report',
                    href: '/provider-report'
                }
            ]
        },
        {
            section: 'CONTAINERS & SERVICE MANAGEMENT',
            items: [
                {
                    name: 'Schedule Delivery',
                    href: '/schedule-delivery'
                },
                {
                    name: 'Order History',
                    href: '/order-history'
                },
                {
                    name: 'Shipping',
                    href: '/shipping'
                },
                {
                    name: 'Report',
                    href: '/container-report'
                }
            ]
        },
        {
            section: 'FINANCE',
            items: [
                {
                    name: 'Receipts',
                    href: '/receipts'
                },
                {
                    name: 'Invoices',
                    href: '/invoices'
                },
                {
                    name: 'Bills',
                    href: '/bills'
                },
                {
                    name: 'Report',
                    href: '/finance-report'
                }
            ]
        }
    ];

    function getIcon(itemName: string) {
        switch(itemName) {
            case 'Dashboard': return BarChart3;
            case 'Schedule Collect':
            case 'Schedule Delivery':
                return Calendar;
            case 'Vehicles':
            case 'Shipping':
                return Truck;
            case 'Drivers':
            case 'Producers':
                return Users;
            case 'Wastes':
                return Package;
            default:
                return FileText;
        }
    }
</script>

<aside class="bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto {sidebarCollapsed ? 'w-16' : 'w-64'}">
    <!-- Logo -->
    <div class="flex items-center p-5 border-b border-gray-200">
        <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Package class="w-5 h-5 text-white"/>
            </div>
            {#if !sidebarCollapsed}
                <span class="font-bold text-xl text-gray-800">WWWASTE</span>
            {/if}
        </div>
    </div>

    <!-- Navigation -->
    <nav class="p-4">
        {#each sidebarItems as section}
            <div class="mb-6">
                {#if !sidebarCollapsed}
                    <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {section.section}
                    </h3>
                {/if}
                <ul class="space-y-1">
                    {#each section.items as item}
                        {@const IconComponent = getIcon(item.name)}
                        <li>
                            <a href={item.href}
                                class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                {page.url.pathname === item.href ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}">
                                <IconComponent class="w-5 h-5 mr-3"/>
                                {#if !sidebarCollapsed}
                                    {item.name}
                                {/if}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}

        <!-- Settings at bottom -->
        <div class="mt-auto pt-4 border-t">
            <a href="/settings" class="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            <Settings class="w-5 h-5 mr-3" />
            {#if !sidebarCollapsed}
                Settings
            {/if}
            </a>
        </div>
    </nav>
</aside>