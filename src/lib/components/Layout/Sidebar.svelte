<script lang="ts">
    import { page } from '$app/state';
	import { FileText, IdCard, LayoutDashboard, Package, Settings, Truck, Users } from '@lucide/svelte';

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
            case 'Dashboard': return LayoutDashboard;
            case 'Schedule Collect': return IdCard;
            case 'Schedule Delivery':
                return IdCard;
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
    <div class="flex items-center h-16 px-4 py-4 border-b border-gray-200">
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
    <nav>
        {#each sidebarItems as section}
            <div class="{!sidebarCollapsed ? 'p-6' : 'p-4 ml-2'} border-b border-gray-200">
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
                                class="flex items-center -ml-2 p-2 rounded-lg text-sm font-medium transition-colors
                                {page.url.pathname === item.href ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}">
                                <IconComponent class="w-5 h-5"/>
                                {#if !sidebarCollapsed}
                                    <span class="ml-4">{item.name}</span>
                                {/if}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}

        <!-- Settings at bottom -->
        <div class="p-4 ml-2 border-b border-gray-200">
            <a href="/settings"
                class="flex items-center -ml-2 p-2 rounded-lg text-sm font-medium transition-colors
                {page.url.pathname === 'settings' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}">
                <Settings class="w-5 h-5"/>
                {#if !sidebarCollapsed}
                    <span class="ml-4">Settings</span>
                {/if}
            </a>
        </div>
    </nav>
</aside>